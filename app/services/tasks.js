const BASE_URL = 'http://localhost:8003/api'

export async function getTasksByTeam(token, teamId) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/tasks/team/${teamId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json()

  return result
}
