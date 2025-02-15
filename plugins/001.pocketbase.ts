import PocketBase, { type AuthRecord } from 'pocketbase';

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  const pb = new PocketBase(config.public.pocketbaseUrl)

  const cookie = useCookie<{ token: string; record: AuthRecord }>('pb_auth', {
    path:     '/',
    secure:   true,
    sameSite: 'lax',
    httpOnly: false,
    maxAge:   604800,
  })

  // load the store data from the cookie value
  pb.authStore.save(cookie.value?.token, cookie.value?.record);

  // send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    cookie.value = {
      token: pb.authStore.token,
      record: pb.authStore.record,
    };
  });

  try {
      // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
      pb.authStore.isValid && await pb.collection('_superusers').authRefresh();
  } catch (_) {
      // clear the auth store on failed refresh
      pb.authStore.clear();
  }

  return {
    provide: { 
      pb 
    }
  }
});