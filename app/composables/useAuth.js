import { useAuthStore } from '~/stores/auth'

export function useAuth() {
  const store = useAuthStore()

  return {
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    success: computed(() => store.success),
    token: computed(() => store.token),
    user: computed(() => store.user),
    login: store.login,
    register: store.register,
    logout: store.logout,
    fetchProfile: store.fetchProfile,
  }
}
