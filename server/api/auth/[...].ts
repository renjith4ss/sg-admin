import { H3Event, createError } from 'h3'
import PocketBase from 'pocketbase'
import { sessionStore } from '../../services/session'
import { auditLogger } from '../../services/audit'
import { generateSessionId } from '../../utils/session'

const pb = new PocketBase(useRuntimeConfig().public.pocketbaseUrl)

export default defineEventHandler(async (event: H3Event) => {
  const method = event.method
  const path = event.path

  if (method === 'POST' && path.endsWith('/login')) {
    return handleLogin(event)
  }

  if (method === 'POST' && path.endsWith('/logout')) {
    return handleLogout(event)
  }

  throw createError({
    statusCode: 404,
    message: 'Not found'
  })
})

async function handleLogin(event: H3Event) {
  const { email, password } = await readBody(event)
  
  try {
    const authData = await pb.collection('admins').authWithPassword(email, password)
    const sessionId = generateSessionId()
    
    // Get user role
    const role = await pb.collection('admin_roles').getFirstListItem(`user_id="${authData.record.id}"`)
    
    // Store session data
    await sessionStore.set(sessionId, {
      userId: authData.record.id,
      email: authData.record.email,
      token: authData.token,
      role: role.role_name
    }, 14 * 24 * 60 * 60 * 1000) // 14 days

    // Set session cookie
    setCookie(event, 'session_id', sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 14 * 24 * 60 * 60 // 14 days
    })

    await auditLogger.log(event, 'login', 'success', { email, role: role.role_name })

    return {
      user: {
        ...authData.record,
        role: role.role_name
      },
      token: authData.token
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    await auditLogger.log(event, 'login', 'failure', { email, error: errorMessage })
    throw error
  }
}

async function handleLogout(event: H3Event) {
  const sessionId = getCookie(event, 'session_id')
  if (sessionId) {
    const session = await sessionStore.get(sessionId)
    if (session) {
      await auditLogger.log(event, 'logout', 'success', { email: session.email })
    }
    await sessionStore.delete(sessionId)
    deleteCookie(event, 'session_id')
  }
  return { success: true }
} 