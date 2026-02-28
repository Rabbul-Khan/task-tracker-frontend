const BASE_URL = 'http://localhost:8003/api'

export async function registerUser(name, email, password) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: password,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json()

  if (!result.status) {
    const error = new Error(result.message || 'Registration failed')
    error.details = result.errors || null
    throw error
  }

  return {
    token: result.token,
    user: result.data,
    message: result.message,
  }
}
