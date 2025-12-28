const BASE_URL = 'http://localhost:8003/api'

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json()

  if (!result.status) {
    throw new Error(result.message || 'Login failed')
  }

  if (!result.token) {
    throw new Error('Missing authentication token in response')
  }

  return {
    token: result.token,
    user: result.data,
  }
}
