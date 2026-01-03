import { SessionData } from '../types';

export class SessionManager {
  private sessions: Map<string, SessionData> = new Map();

  createSession(
    sessionId: string,
    userId: string | undefined,
    mode: 'english_practice' | 'interview' | 'language_learning' | 'roleplay',
    domain?: string,
    targetLanguage: string = 'en',
    nativeLanguage: string = 'Hindi'
  ): SessionData {
    const session: SessionData = {
      sessionId,
      userId,
      mode,
      domain,
      targetLanguage,
      nativeLanguage,
      startTime: new Date(),
      errorsCount: 0,
      correctionsCount: 0,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): SessionData | undefined {
    return this.sessions.get(sessionId);
  }

  updateSession(sessionId: string, updates: Partial<SessionData>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
    }
  }

  incrementErrors(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.errorsCount++;
    }
  }

  incrementCorrections(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.correctionsCount++;
    }
  }

  endSession(sessionId: string): SessionData | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.sessions.delete(sessionId);
    }
    return session;
  }

  getAllSessions(): SessionData[] {
    return Array.from(this.sessions.values());
  }
}
