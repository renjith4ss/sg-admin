import PocketBase from 'pocketbase'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { $pb } = useNuxtApp()
  const pb = $pb as PocketBase

  // Cookie configuration for auth token
  const tokenCookie = useCookie<string | null>("pb_auth", {
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 31536000, // 1 year
  })

  // Listen for auth changes and update cookie
  pb.authStore.onChange((token) => {
    tokenCookie.value = token || null
  })

  if(tokenCookie.value) {
    pb.authStore.save(tokenCookie.value)
    await pb.collection('_superusers').authRefresh()
  }
})
