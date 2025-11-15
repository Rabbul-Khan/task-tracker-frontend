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
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ name, email, password, password_confirmation: password }),
    })

    const result = await response.json().catch(() => ({}))

    // Handle validation or backend errors (Laravel style)
    if (!response.ok || !result.status) {
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
  catch (err) {
    console.error('Registration error:', err)
    throw err
  }
}
