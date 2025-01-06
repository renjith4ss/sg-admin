interface SessionData {
  userId: string
  email: string
  token: string
  role: string
}

class SessionStore {
  private sessions: Map<string, { data: SessionData; expiresAt: number }> = new Map()

  async set(sessionId: string, data: SessionData, ttlMs: number): Promise<void> {
    this.sessions.set(sessionId, {
      data,
      expiresAt: Date.now() + ttlMs
    })
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId)
      return null
    }

    return session.data
  }

  async delete(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId)
  }

  async cleanup(): Promise<void> {
    const now = Date.now()
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(sessionId)
      }
    }
  }
}

export const sessionStore = new SessionStore() 