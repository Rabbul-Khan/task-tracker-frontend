const BASE_URL = 'http://192.168.10.46:8003/api'

export async function getMyProfile(token) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return await response.json()
}

export async function updateMyProfile(token, data) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return await response.json()
}
