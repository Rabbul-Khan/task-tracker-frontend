/* eslint-disable jsdoc/require-returns-description */
const BASE_URL = 'http://localhost:8003/api'

/**
 * Register a new user
 * @param {string} name - User's full name
 * @param {string} email - User email
 * @param {string} password - User password
 // eslint-disable-next-line jsdoc/require-returns-description
 * @returns {Promise<{token: string, user: object}>}
 */
export async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, password_confirmation: password }),
    })

    // Handle network-level errors
    if (!response.ok) {
      throw new Error(`Network error: ${response.status}`)
    }

    const result = await response.json()

    // Handle backend/application-level errors
    if (!result.status) {
      throw new Error(result.message || 'Registration failed')
    }

    // Validate response structure
    if (!result.token || !result.data) {
      throw new Error('Invalid response structure from server')
    }

    return {
      token: result.token,
      user: result.data,
    }
  }
  catch (err) {
    console.error('Registration error:', err)
    throw err
  }
}
