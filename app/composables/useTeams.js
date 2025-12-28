import { createNewTeam, getAllTeams } from '~/services/teams'

export function useTeams() {
  const loading = ref(false)
  const error = ref('')
  const teams = ref([])
  const isModalOpen = ref(false)
  const state = reactive({
    teamName: undefined,
  })

  // Use useState for SSR-safe reactive state (shared with useAuth)
  // eslint-disable-next-line no-undef
  const token = useState('auth-token', () => {
    // Only access localStorage on client-side
    if (import.meta.client) {
      return localStorage.getItem('token')
    }
    return null
  })

  // Ensure token is synced from localStorage on client-side
  function getToken() {
    if (import.meta.client && !token.value) {
      token.value = localStorage.getItem('token')
    }
    return token.value
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

  return { getTeams, openModal, closeModal, createTeam, teams, loading, isModalOpen, error, state }
}
