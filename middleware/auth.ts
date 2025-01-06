export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  // Skip middleware for login page
  if (to.path === '/login') {
    return
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated.value) {
    return navigateTo(`/login?redirect=${to.fullPath}`, {
      replace: true
    })
  }
}) 