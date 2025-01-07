import { createError, defineEventHandler, getQuery, readBody, setCookie, deleteCookie, getCookie } from 'h3'
import { sessionStore } from '~/server/services/session'
import { usePocketBase } from '~/services/pocketbase'
import type { RecordModel } from 'pocketbase'

interface AuthResponse {
  token: string
  record: RecordModel
}

interface RefreshResponse {
  token: string
}

const REFRESH_TOKEN_COOKIE = 'refresh_token'
const SESSION_COOKIE = 'session_id'
const TOKEN_EXPIRY = 30 * 60 * 1000 // 30 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 days

export default defineEventHandler(async (event) => {
  const path = event.path || ''
  const method = event.method
  console.log(path, method)

  // Handle refresh token
  if (path.endsWith('/refresh') && method === 'POST') {
    const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE)
    if (!refreshToken) {
      throw createError({
        statusCode: 401,
        message: 'No refresh token provided'
      })
    }

    try {
      const pb = usePocketBase()
      const result = await pb?.refreshAuth() as AuthResponse
      
      if (!result?.token) {
        throw new Error('Failed to refresh token')
      }

      // Update session
      const sessionId = getCookie(event, SESSION_COOKIE)
      if (sessionId) {
        await sessionStore.set(sessionId, {
          userId: result.record.id,
          email: result.record.email,
          token: result.token,
          role: result.record.role
        }, TOKEN_EXPIRY)
      }

      return { token: result.token } as RefreshResponse
    } catch (error: any) {
      throw createError({
        statusCode: 401,
        message: error.message || 'Failed to refresh token'
      })
    }
  }

  // Handle setting refresh token
  if (path.endsWith('/set-refresh-token') && method === 'POST') {
    const body = await readBody(event)
    if (!body.refreshToken) {
      throw createError({
        statusCode: 400,
        message: 'No refresh token provided in body'
      })
    }

    setCookie(event, REFRESH_TOKEN_COOKIE, body.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TOKEN_EXPIRY / 1000 // Convert to seconds
    })

    return { success: true }
  }

  // Handle clearing refresh token
  if (path.endsWith('/clear-refresh-token') && method === 'POST') {
    deleteCookie(event, REFRESH_TOKEN_COOKIE)
    deleteCookie(event, SESSION_COOKIE)
    return { success: true }
  }

  throw createError({
    statusCode: 404,
    message: 'Not found'
  })
}) 