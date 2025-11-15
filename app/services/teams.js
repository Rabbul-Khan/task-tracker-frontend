const BASE_URL = 'http://localhost:8003/api'

export async function fetchMyTeams(token) {
  try {
    const response = await fetch(`${BASE_URL}/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    // Handle validation or backend errors (Laravel style)
    if (!response.ok) {
      throw new Error('Failed to fetch teams')
    }

    const result = await response.json()

    if (!result.status) {
      throw new Error(result.message || 'Failed to fetch teams')
    }

    return result.data
  }
  catch (err) {
    console.error('Fetch teams error:', err)
    throw err
  }
}

export async function createTeam(token, teamName) {
  try {
    const response = await fetch(`${BASE_URL}/teams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: teamName }),
    })

    if (!response.ok) {
      throw new Error('Failed to create team')
    }

    const result = await response.json()

    if (!result.status) {
      throw new Error(result.message || 'Failed to create team')
    }

    return result.data
  }
  catch (err) {
    console.error('Create team error:', err)
    throw err
  }
}
