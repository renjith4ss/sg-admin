import { H3Event, getCookie } from 'h3'
import { Resource, Permission, rbacService } from '../services/rbac'

interface RoutePermission {
  resource: Resource
  permission: Permission
}

const routePermissions: Record<string, RoutePermission> = {
  '/api/users': { resource: 'users', permission: 'read' },
  '/api/users/create': { resource: 'users', permission: 'write' },
  '/api/users/delete': { resource: 'users', permission: 'delete' },
  '/api/settings': { resource: 'settings', permission: 'read' },
  '/api/settings/update': { resource: 'settings', permission: 'write' }
  // Add more route permissions as needed
}

export default defineEventHandler(async (event: H3Event) => {
  // Skip RBAC for auth routes
  if (event.path.startsWith('/api/auth/')) {
    return
  }

  // Find matching route permission
  const permission = Object.entries(routePermissions).find(([route]) => 
    event.path.startsWith(route)
  )?.[1]

  if (permission) {
    await rbacService.checkPermission(
      event,
      permission.resource,
      permission.permission
    )
  }
}) 