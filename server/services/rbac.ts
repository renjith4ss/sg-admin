import { H3Event, createError, getCookie } from 'h3'
import { sessionStore } from '../services/session'

export type Resource = 'users' | 'settings'
export type Permission = 'read' | 'write' | 'delete'
export type Role = 'admin' | 'editor' | 'viewer'

const rolePermissions: Record<Role, Record<Resource, Permission[]>> = {
  admin: {
    users: ['read', 'write', 'delete'],
    settings: ['read', 'write', 'delete']
  },
  editor: {
    users: ['read', 'write'],
    settings: ['read', 'write']
  },
  viewer: {
    users: ['read'],
    settings: ['read']
  }
}

class RBACService {
  async checkPermission(event: H3Event, resource: Resource, permission: Permission) {
    const sessionId = getCookie(event, 'session_id')
    if (!sessionId) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const session = await sessionStore.get(sessionId)
    if (!session) {
      throw createError({
        statusCode: 401,
        message: 'Invalid session'
      })
    }

    const role = session.role as Role
    const permissions = rolePermissions[role]?.[resource] || []

    if (!permissions.includes(permission)) {
      throw createError({
        statusCode: 403,
        message: 'Forbidden'
      })
    }
  }

  async getUserPermissions(role: Role): Promise<Record<Resource, Permission[]>> {
    return rolePermissions[role] || {}
  }
}

export const rbacService = new RBACService() 