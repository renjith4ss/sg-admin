import type PocketBase from 'pocketbase'
export default defineNuxtRouteMiddleware(async (to) => {
  const pb = useNuxtApp().$pb as PocketBase
  
  // Check authentication
  if (!pb.authStore.isValid && to.path !== '/login') {
    return navigateTo(`/login?redirect=${to.fullPath}`)
  }

  if (pb.authStore.isValid && to.path === '/login') {
    return navigateTo('/')
  }
})