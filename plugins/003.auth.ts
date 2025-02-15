import type PocketBase from 'pocketbase'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    const authStore = useAuthStore()
    const pb = useNuxtApp().$pb as PocketBase
    pb.authStore.onChange(() => {
      if (pb.authStore.isValid && !authStore.user) {
        authStore.refreshSession()
      }
    }, true)
    
    if (pb.authStore.isValid) {
      authStore.refreshSession()
    }
  }
})
