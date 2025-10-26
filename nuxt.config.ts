import tailwindcss from '@tailwindcss/vite'
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui'],
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
