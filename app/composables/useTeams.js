import { getTasksByTeam } from '~/services/tasks'
import { createNewTeam, getAllTeams } from '~/services/teams'
import { useAuthStore } from '~/stores/auth'

export function useTeams() {
  const authStore = useAuthStore()

  const loading = ref(false)
  const error = ref('')
  const teams = ref([])
  const teamTasks = ref({})
  const isModalOpen = ref(false)
  const state = reactive({
    teamName: undefined,
  })

  function getToken() {
    return authStore.token
  }

  function openModal() {
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
    state.teamName = undefined
    error.value = ''
  }

  async function getTeams() {
    try {
      loading.value = true
      error.value = ''

      const data = await getAllTeams(getToken())
      teams.value = data.data
    }
    catch (err) {
      error.value = err?.message || 'Unable to fetch teams. Please try again.'
    }
    finally {
      loading.value = false
    }
  }

  async function createTeam(event) {
    loading.value = true
    error.value = ''

    try {
      const result = await createNewTeam(getToken(), event.data.teamName)
      const newTeam = result.data || result

      // Add the new team to the list (handle missing fields gracefully)
      teams.value.push({
        id: newTeam.id || Date.now(),
        name: newTeam.name || event.data.teamName,
        ownerName: newTeam.owner?.name,
        ownerAvatar: newTeam.owner?.avatar,
        createdAt: newTeam.created_at,
        membersCount: newTeam.members_count ?? 1,
      })

      closeModal()
    }
    catch (err) {
      console.error('Failed to create team:', err)
      error.value = err?.message || 'Unable to create team. Please try again.'
    }
    finally {
      loading.value = false
    }
  }

  async function getTeamTasks(teamId) {
    try {
      const data = await getTasksByTeam(getToken(), teamId)
      teamTasks.value[teamId] = data.data
    }
    catch (err) {
      console.error(`Failed to fetch tasks for team ${teamId}:`, err)
      teamTasks.value[teamId] = []
    }
  }

  async function getAllTeamsTasks() {
    await Promise.all(teams.value.map(team => getTeamTasks(team.id)))
  }

  return { getTeams, openModal, closeModal, createTeam, getTeamTasks, getAllTeamsTasks, teams, teamTasks, loading, isModalOpen, error, state }
}
