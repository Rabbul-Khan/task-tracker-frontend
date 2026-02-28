const BASE_URL = 'http://localhost:8003/api'

export async function getAllTeams(token) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json() // let this throw

  return result
}

export async function createNewTeam(token, name) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json() // let this throw

  return result
}

export async function inviteToTeam(token, teamId, email) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams/invite`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ team_id: teamId, email }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || `HTTP ${response.status}`)
  }

  const result = await response.json()

  return result
}
