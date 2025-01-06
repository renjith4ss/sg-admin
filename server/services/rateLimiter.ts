import PocketBase from 'pocketbase'
import { H3Event } from 'h3'

export class IPRateLimiter {
  private pb: PocketBase
  private windowMs: number
  private maxRequests: number

  constructor(url: string, windowMs = 60000, maxRequests = 5) {
    this.pb = new PocketBase(url)
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  async isRateLimited(event: H3Event): Promise<boolean> {
    const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
    const now = Date.now()
    const windowStart = new Date(now - this.windowMs).toISOString()

    try {
      const requests = await this.pb.collection('rate_limits').getList(1, 0, {
        filter: `ip = "${ip}" && timestamp > "${windowStart}"`
      })

      if (requests.totalItems >= this.maxRequests) {
        return true
      }

      await this.pb.collection('rate_limits').create({
        ip,
        timestamp: new Date(now).toISOString()
      })

      return false
    } catch (error) {
      console.error('Rate limit check failed:', error)
      return false // Fail open if rate limiting is broken
    }
  }

  async cleanup() {
    try {
      const expired = await this.pb.collection('rate_limits').getList(1, 50, {
        filter: `timestamp < "${new Date(Date.now() - this.windowMs).toISOString()}"`
      })
      await Promise.all(
        expired.items.map(record => this.pb.collection('rate_limits').delete(record.id))
      )
    } catch (error) {
      console.error('Rate limit cleanup failed:', error)
    }
  }
}

// Create singleton instance
const config = useRuntimeConfig()
export const ipRateLimiter = new IPRateLimiter(config.public.pocketbaseUrl) 