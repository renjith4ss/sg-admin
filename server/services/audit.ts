import { H3Event } from 'h3'
import PocketBase from 'pocketbase'

type AuditAction = 'login' | 'logout' | 'access_denied'
type AuditStatus = 'success' | 'failure'

interface AuditLog {
  timestamp: string
  action: AuditAction
  status: AuditStatus
  userId?: string
  email?: string
  ipAddress: string
  userAgent: string
  details?: Record<string, any>
}

class AuditLogger {
  private pb: PocketBase

  constructor() {
    const config = useRuntimeConfig()
    this.pb = new PocketBase(config.public.pocketbaseUrl)
  }

  async log(
    event: H3Event,
    action: AuditAction,
    status: AuditStatus,
    details?: Record<string, any>
  ): Promise<void> {
    const headers = getHeaders(event)
    const ipAddress = headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown'
    const userAgent = headers['user-agent'] || 'unknown'

    const log: AuditLog = {
      timestamp: new Date().toISOString(),
      action,
      status,
      ipAddress,
      userAgent,
      details
    }

    try {
      await this.pb.collection('audit_logs').create(log)
    } catch (error) {
      console.error('Failed to create audit log:', error)
    }
  }
}

export const auditLogger = new AuditLogger() 