// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon'
  ],

  app: {
    head: {
      title: 'Nuxt App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.NUXT_PUBLIC_POCKETBASE_URL
    }
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  compatibilityDate: '2025-01-06'
})