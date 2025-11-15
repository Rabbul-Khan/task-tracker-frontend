import tailwindcss from '@tailwindcss/vite'
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon',
    'nuxt-vue3-google-signin',
  ],
  googleSignIn: {
    clientId: '130333221520-dnfu1lu9uiq1t7ps2ve1s7hejarcsk2f.apps.googleusercontent.com',
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ['../app/assets/css/main.css'],
})
