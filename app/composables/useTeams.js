import { createTeam, fetchMyTeams } from '~/services/teams'

export function useTeams() {
  const teams = ref([])
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  async function getMyTeams(token) {
    try {
      loading.value = true
      error.value = ''

      const data = await fetchMyTeams(token)
      teams.value = data

      return data
    }
    catch (err) {
      error.value = err.message || 'Failed to load teams'
      return null
    }
    finally {
      loading.value = false
    }
  }

  async function addTeam(token, teamName) {
    try {
      loading.value = true
      error.value = ''
      success.value = ''

      const newTeam = await createTeam(token, teamName)

      // Add the new team to the existing teams array
      teams.value.push(newTeam)

      success.value = 'Team created successfully'

      // Clear success message after 3 seconds
      setTimeout(() => {
        success.value = ''
      }, 3000)

      return newTeam
    }
    catch (err) {
      error.value = err.message || 'Failed to create team'
      return null
    }
    finally {
      loading.value = false
    }
  }

  return {
    teams,
    loading,
    error,
    success,
    getMyTeams,
    addTeam,
  }
}
