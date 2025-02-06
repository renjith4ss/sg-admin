// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'shadcn-nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon',
    '@nuxt/fonts'
  ],

  css: ['~/assets/css/main.scss'],

  app: {
    head: {
      title: 'SG Admin',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        }
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
    fallback: 'light',
    storage: 'cookie'
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  fonts: {
    families: [
      {
        name: 'Geist',
        provider: 'google',
        weights: [400, 500, 600, 700],
      }
    ]
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  experimental: {
    payloadExtraction: false
  },

  devtools: {
    enabled: true
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
  compatibilityDate: '2025-02-06',
})