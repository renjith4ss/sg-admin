import PocketBase from 'pocketbase'

export class SessionStore {
  private pb: PocketBase

  constructor(url: string) {
    this.pb = new PocketBase(url)
  }

  async set(sessionId: string, data: any, expiresIn: number) {
    await this.pb.collection('sessions').create({
      id: sessionId,
      data: JSON.stringify(data),
      expires: new Date(Date.now() + expiresIn).toISOString()
    })
  }

  async get(sessionId: string) {
    try {
      const record = await this.pb.collection('sessions').getOne(sessionId)
      if (new Date(record.expires) < new Date()) {
        await this.delete(sessionId)
        return null
      }
      return JSON.parse(record.data)
    } catch {
      return null
    }
  }

  async delete(sessionId: string) {
    try {
      await this.pb.collection('sessions').delete(sessionId)
    } catch {
      // Ignore deletion errors
    }
  }

  async cleanup() {
    try {
      const expired = await this.pb.collection('sessions').getList(1, 50, {
        filter: `expires < "${new Date().toISOString()}"`
      })
      await Promise.all(
        expired.items.map(session => this.delete(session.id))
      )
    } catch (error) {
      console.error('Session cleanup failed:', error)
    }
  }
}

// Create singleton instance
const config = useRuntimeConfig()
export const sessionStore = new SessionStore(config.public.pocketbaseUrl) 