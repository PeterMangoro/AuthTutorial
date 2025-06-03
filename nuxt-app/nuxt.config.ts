// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules:['@pinia/nuxt'],

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || 'http://localhost:3000/api',
    }
  }
})
