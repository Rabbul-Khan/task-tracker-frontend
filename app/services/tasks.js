const BASE_URL = 'http://192.168.10.46:8003/api'

export async function getTasksByTeam(token, teamId, filters = {}) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value)
    }
  }
  const query = params.toString()
  const url = `${BASE_URL}/teams/${teamId}/tasks${query ? `?${query}` : ''}`

  const response = await fetch(url, {
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

export async function getTask(token, teamId, taskId) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams/${teamId}/tasks/${taskId}`, {
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

export async function getSelfTasks(token) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/tasks/self`, {
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

export async function createTask(token, teamId, data) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams/${teamId}/tasks`, {
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

export async function updateTask(token, taskId, data, teamId) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams/${teamId}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, task_id: taskId, team_id: teamId }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const result = await response.json()

  return result
}

export async function deleteTask(token, taskId, teamId) {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  const response = await fetch(`${BASE_URL}/teams/${teamId}/tasks/${taskId}`, {
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
