import { loginUser } from '~/services/login'
import { registerUser } from '~/services/register'

export function useAuth() {
  const loading = ref(false)
  const error = ref('')
  const success = ref(null)
  const user = ref(null)

  // Use useState for SSR-safe reactive state
  // eslint-disable-next-line no-undef
  const token = useState('auth-token', () => {
    // Only access localStorage on client-side
    if (import.meta.client) {
      return localStorage.getItem('token')
    }
    return null
  })

  async function login(email, password) {
    try {
      loading.value = true
      error.value = ''
      const data = await loginUser(email, password)

      // Update reactive state
      token.value = data.token

      // Persist to localStorage (client-side only)
      if (import.meta.client) {
        localStorage.setItem('token', data.token)
      }
    }
    catch (err) {
      if (err) {
        error.value = 'Invalid email or password'
      }
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

      // Update reactive state
      user.value = data.user
      // token.value = data.token
      success.value = data.message

      // fade-out after 2 seconds
      setTimeout(() => {
        success.value = null
      }, 2000)

      // Persist to localStorage (client-side only)
      // if (import.meta.client) {
      //   localStorage.setItem('token', data.token)
      // }
    }
    catch (err) {
      error.value = err.message || 'Registration failed'
    }

    finally {
      loading.value = false
    }
  }

  return { loading, error, login, register, token, success }
}
