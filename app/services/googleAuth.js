const BASE_URL = 'http://localhost:8003/api'

export async function googleLogin(credential) {
  try {
    const response = await fetch(`${BASE_URL}/google/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    })

    // Handle network-level errors (e.g. server down)
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`)
    }

    const result = await response.json()

    // Handle backend/application-level errors
    if (!result.status) {
      throw new Error(result.message || 'Google login failed')
    }

    // Optionally validate token or data
    if (!result.token) {
      throw new Error('Missing authentication token in response')
    }

    return {
      token: result.token,
      user: result.data,
    }
  }
  catch (err) {
    // Catch both network & backend errors
    console.error('Google login error:', err)
    throw err // Re-throw so the caller (component) can show an error message
  }
}
