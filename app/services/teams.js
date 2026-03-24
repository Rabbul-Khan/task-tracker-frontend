const BASE_URL = 'http://192.168.10.46:8003/api'

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

  const result = await response.json()

  return result
}

export async function getTeam(token, teamId) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams/${teamId}`, {
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

export async function getTeamMembers(token, teamId) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams/${teamId}/members`, {
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

  const result = await response.json()

  return result
}

export async function updateTeam(token, teamId, data) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams/${teamId}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json()

  return result
}

export async function deleteTeam(token, teamId) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams/${teamId}`, {
    method: 'DELETE',
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

export async function inviteToTeam(token, data) {
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
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json()

  return result
}

export async function acceptInvitation(token, data) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams/invite/accept`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json()

  return result
}
