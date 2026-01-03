import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

export class DeepgramService {
  private client;

  constructor() {
    this.client = createClient(process.env.DEEPGRAM_API_KEY || '');
  }

  // Create live transcription connection
  createLiveTranscription(onTranscript: (text: string, isFinal: boolean) => void, onError: (error: any) => void) {
    const connection = this.client.listen.live({
      model: 'nova-2',
      language: 'en',
      smart_format: true,
      interim_results: true, // KEY: Enable real-time partial transcripts
      punctuate: true,
      utterance_end_ms: 1000,
    });

    connection.on(LiveTranscriptionEvents.Open, () => {
      console.log('Deepgram connection opened');
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
      const transcript = data.channel?.alternatives?.[0]?.transcript;
      const isFinal = data.is_final;
      
      if (transcript && transcript.length > 0) {
        onTranscript(transcript, isFinal);
      }
    });

    connection.on(LiveTranscriptionEvents.Error, (error: any) => {
      console.error('Deepgram error:', error);
      onError(error);
    });

    connection.on(LiveTranscriptionEvents.Close, () => {
      console.log('Deepgram connection closed');
    });

    return connection;
  }

  // Text-to-speech using Deepgram
  async textToSpeech(text: string): Promise<Buffer> {
    try {
      const response = await this.client.speak.request(
        { text },
        {
          model: 'aura-asteria-en',
          encoding: 'linear16',
          container: 'wav',
        }
      );

      const stream = await response.getStream();
      const chunks: Uint8Array[] = [];
      
      if (stream) {
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error('TTS error:', error);
      throw error;
    }
  }
}
