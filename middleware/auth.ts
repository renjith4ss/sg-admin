export default defineNuxtRouteMiddleware(async (to) => {

  const { initialize } = usePocketbase();
  await initialize(); // Initialize on every route change

  // Optional: Redirect if not authenticated
  const { user } = usePocketbase();
  if (!user.value && to.path !== '/login') {
    return navigateTo(`/login${to.path === '/login' ? '' : '?redirect=' + to.fullPath}`);
  }
  if (user.value && to.path === '/login') {
    return navigateTo('/');
  }
})