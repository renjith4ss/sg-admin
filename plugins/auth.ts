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
    console.log('authCookie', authCookie.value)
    if (authCookie.value) {
      console.log('Restoring auth state from cookie')
      try {
        const { token, model } = authCookie.value
        pb.authStore.save(token, model)
        
        // Verify the token is still valid
        const isValid = await pb.authStore.isValid
        if (!isValid) {
          pb.authStore.clear()
          authCookie.value = null
        } else {
          console.log('Fetching current user')
          await useAuthStore().fetchCurrentUser()
        }
      } catch (err) {
        console.error('Failed to restore auth state:', err)
        pb.authStore.clear()
        authCookie.value = null
      }
    }

    // Then set up the onChange listener (client-side only)
    if (import.meta.client) {
      console.log('Setting up auth listener')
      pb.authStore.onChange(async (token, model) => {
        console.log('Auth listener triggered')
        const authCookie = useCookie<AuthCookie | null>('pb_auth', {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          secure: true,
          sameSite: 'lax'
        })

        if (token) {
          console.log('Setting auth cookie')
          authCookie.value = { token, model }
          await useAuthStore().fetchCurrentUser()
        } else {
          authCookie.value = null
        }
      })
    }
  }
}) 