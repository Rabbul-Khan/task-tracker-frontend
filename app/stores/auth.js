import { defineStore } from 'pinia'
import { loginUser, logoutUser } from '~/services/login'
import { getMyProfile } from '~/services/profile'
import { registerUser } from '~/services/register'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref('')
  const success = ref(null)

  async function fetchProfile() {
    if (!token.value)
      return
    try {
      const data = await getMyProfile(token.value)
      user.value = data.data ?? data
    }
    catch {
      user.value = null
    }
  }

  async function login(email, password) {
    try {
      loading.value = true
      error.value = ''
      const data = await loginUser(email, password)

      token.value = data.token
      if (import.meta.client) {
        localStorage.setItem('token', data.token)
      }

      // Fetch profile after successful login
      await fetchProfile()
    }
    catch {
      error.value = 'Invalid email or password'
    }
    finally {
      loading.value = false
    }
  }

  async function register(name, email, password) {
    loading.value = true
    error.value = ''
    success.value = null
    try {
      const data = await registerUser(name, email, password)
      user.value = data.user
      success.value = data.message

      setTimeout(() => {
        success.value = null
      }, 2000)
    }
    catch (err) {
      error.value = err.message || 'Registration failed'
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      if (token.value) {
        await logoutUser(token.value)
      }
    }
    catch {}
    finally {
      token.value = null
      user.value = null
      if (import.meta.client) {
        localStorage.removeItem('token')
      }
      // eslint-disable-next-line no-undef
      navigateTo('/login')
    }
  }

  return {
    token,
    user,
    loading,
    error,
    success,
    fetchProfile,
    login,
    register,
    logout,
  }
})
