import { useCookie } from '#app'
import { usePocketBaseService } from '~/services/pocketbase'

interface AuthCookie {
  token: string
  model: any // or your specific model type
}

export default defineNuxtPlugin({
  name: 'auth',
  enforce: 'pre',
  async setup() {
    const pb = usePocketBaseService()
    
    // First, try to restore auth from cookie (during SSR and client)
    const authCookie = useCookie<AuthCookie | null>('pb_auth')
    if (authCookie.value) {
      try {
        const { token, model } = authCookie.value
        pb.authStore.save(token, model)
        
        // Verify the token is still valid
        const isValid = await pb.authStore.isValid
        if (!isValid) {
          pb.authStore.clear()
          authCookie.value = null
        }
      } catch (err) {
        console.error('Failed to restore auth state:', err)
        pb.authStore.clear()
        authCookie.value = null
      }
    }

    // Then set up the onChange listener (client-side only)
    if (import.meta.client) {
      pb.authStore.onChange((token, model) => {
        const authCookie = useCookie<AuthCookie | null>('pb_auth', {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          secure: true,
          sameSite: 'lax'
        })

        if (token) {
          authCookie.value = { token, model }
        } else {
          authCookie.value = null
        }
      })
    }
  }
}) 