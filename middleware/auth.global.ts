import type PocketBase from 'pocketbase'
export default defineNuxtRouteMiddleware(async (to) => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase
  const authStore = useAuthStore()
  
  // Check authentication
  if (!pb.authStore.isValid && to.path !== '/login') {
    return navigateTo(`/login?redirect=${to.fullPath}`)
  }
  
  if(pb.authStore.isValid) {
    await authStore.refreshSession()
  }

  if (pb.authStore.isValid && to.path === '/login') {
    return navigateTo('/')
  }
})