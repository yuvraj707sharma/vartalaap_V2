import WebSocket from 'ws';
import { DeepgramService } from '../services/deepgram';
import { ErrorDetectorService } from '../services/error-detector';
import { SessionManager } from '../services/session';
import { v4 as uuidv4 } from 'uuid';

// Install uuid package
// npm install uuid @types/uuid

const sessionManager = new SessionManager();

export function handleWebSocketConnection(ws: WebSocket) {
  console.log('New WebSocket connection');

  const sessionId = uuidv4();
  let deepgramService: DeepgramService;
  let errorDetector: ErrorDetectorService;
  let deepgramConnection: any;
  let currentTranscript = '';
  let lastErrorCheckTime = Date.now();

  ws.on('message', async (message: string) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'start_session':
          // Initialize session
          const session = sessionManager.createSession(
            sessionId,
            data.userId,
            data.mode || 'english_practice',
            data.domain,
            data.targetLanguage || 'en',
            data.nativeLanguage || 'Hindi'
          );

          deepgramService = new DeepgramService();
          errorDetector = new ErrorDetectorService(session.nativeLanguage);

          // Setup Deepgram live transcription
          deepgramConnection = deepgramService.createLiveTranscription(
            async (text: string, isFinal: boolean) => {
              // Send transcript to client
              ws.send(JSON.stringify({
                type: 'transcript',
                data: { text, isFinal },
                timestamp: new Date(),
              }));

              // Accumulate transcript for error detection
              if (isFinal) {
                currentTranscript += ' ' + text;
              }

              // Real-time error detection on interim results
              // Check every 300ms to avoid too frequent checks
              const now = Date.now();
              if (now - lastErrorCheckTime > 300 && text.length > 10) {
                lastErrorCheckTime = now;
                
                // Quick filler detection
                const fillers = errorDetector.detectFillers(text);
                if (fillers.length > 0) {
                  ws.send(JSON.stringify({
                    type: 'correction',
                    data: {
                      hasError: true,
                      originalText: text,
                      errorType: 'filler',
                      explanation: `Remove filler words: ${fillers.join(', ')}`,
                      explanationNative: `Filler words हटाओ: ${fillers.join(', ')}`,
                      detectionMethod: 'rule',
                    },
                    timestamp: new Date(),
                  }));
                  sessionManager.incrementErrors(sessionId);
                }

                // Full error detection
                const error = await errorDetector.detectError(text);
                if (error.hasError) {
                  ws.send(JSON.stringify({
                    type: 'correction',
                    data: error,
                    timestamp: new Date(),
                  }));
                  sessionManager.incrementErrors(sessionId);
                  sessionManager.incrementCorrections(sessionId);

                  // Generate audio correction
                  try {
                    const correctionText = `Stop! ${error.explanation}. ${error.explanationNative}. Continue...`;
                    const audioBuffer = await deepgramService.textToSpeech(correctionText);
                    
                    ws.send(JSON.stringify({
                      type: 'audio_correction',
                      data: audioBuffer.toString('base64'),
                      timestamp: new Date(),
                    }));
                  } catch (err) {
                    console.error('TTS error:', err);
                  }
                }
              }
            },
            (error) => {
              ws.send(JSON.stringify({
                type: 'error',
                data: { message: 'Transcription error', error },
                timestamp: new Date(),
              }));
            }
          );

          ws.send(JSON.stringify({
            type: 'session_started',
            data: { sessionId },
            timestamp: new Date(),
          }));
          break;

        case 'audio':
          // Forward audio to Deepgram
          if (deepgramConnection) {
            const audioBuffer = Buffer.from(data.data, 'base64');
            deepgramConnection.send(audioBuffer);
          }
          break;

        case 'end_session':
          // Close Deepgram connection
          if (deepgramConnection) {
            deepgramConnection.finish();
          }

          const endedSession = sessionManager.endSession(sessionId);
          
          ws.send(JSON.stringify({
            type: 'session_ended',
            data: endedSession,
            timestamp: new Date(),
          }));
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Server error', error: String(error) },
        timestamp: new Date(),
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    if (deepgramConnection) {
      deepgramConnection.finish();
    }
    sessionManager.endSession(sessionId);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}
