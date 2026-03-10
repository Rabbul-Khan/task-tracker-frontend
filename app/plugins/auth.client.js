import { useAuthStore } from '~/stores/auth'

// eslint-disable-next-line no-undef
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const stored = localStorage.getItem('token')
  if (stored) {
    authStore.token = stored
  }
})
