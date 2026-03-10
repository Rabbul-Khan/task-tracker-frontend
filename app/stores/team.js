import { defineStore } from 'pinia'
import { createTask, deleteTask, getTasksByTeam, updateTask } from '~/services/tasks'
import { deleteTeam as deleteTeamApi, getTeam, getTeamMembers, updateTeam as updateTeamApi } from '~/services/teams'
import { useAuthStore } from '~/stores/auth'

export const useTeamStore = defineStore('team', () => {
  const authStore = useAuthStore()

  // Core state
  const teamId = ref(null)
  const teamName = ref('')
  const activeSection = ref('todays-tasks')

  // Section data
  const tasks = ref([])
  const todaysTasks = ref([])
  const members = ref([])

  // Loading states
  const tasksLoading = ref(false)
  const todaysTasksLoading = ref(false)
  const membersLoading = ref(false)

  // Error states
  const tasksError = ref('')

  // Settings state
  const updatingTeam = ref(false)
  const updateTeamError = ref('')
  const deletingTeam = ref(false)

  // Lazy-loading tracker
  const loadedSections = ref(new Set())

  function getToken() {
    return authStore.token
  }

  // --- Data loaders ---

  async function loadTeamInfo() {
    try {
      const data = await getTeam(getToken(), teamId.value)
      teamName.value = data.data?.name ?? data.name ?? ''
    }
    catch (err) {
      console.error('Failed to load team info', err)
    }
  }

  async function loadTasks() {
    if (!Number.isFinite(teamId.value)) {
      tasks.value = []
      return
    }

    tasksLoading.value = true
    tasksError.value = ''

    try {
      const data = await getTasksByTeam(getToken(), teamId.value)
      tasks.value = data.data ?? []
    }
    catch (err) {
      console.error('Failed to load tasks', err)
      tasksError.value = err?.message || 'Unable to load tasks right now. Please try again shortly.'
    }
    finally {
      tasksLoading.value = false
    }
  }

  async function loadTodaysTasks() {
    if (!Number.isFinite(teamId.value)) {
      todaysTasks.value = []
      return
    }

    todaysTasksLoading.value = true

    try {
      const data = await getTasksByTeam(getToken(), teamId.value, { status: 'in progress' })
      todaysTasks.value = data.data ?? []
    }
    catch (err) {
      console.error('Failed to load today\'s tasks', err)
    }
    finally {
      todaysTasksLoading.value = false
    }
  }

  async function loadMembers() {
    membersLoading.value = true

    try {
      const data = await getTeamMembers(getToken(), teamId.value)
      members.value = data.data ?? []
    }
    catch (err) {
      console.error('Failed to load members', err)
    }
    finally {
      membersLoading.value = false
    }
  }

  // --- Section loading ---

  function loadSectionData(section) {
    if (loadedSections.value.has(section))
      return
    loadedSections.value.add(section)

    switch (section) {
      case 'todays-tasks':
        loadTodaysTasks()
        break
      case 'all-tasks':
        loadTasks()
        break
      case 'members':
        loadMembers()
        break
      case 'settings':
        loadTeamInfo()
        break
    }
  }

  function invalidateTaskSections() {
    loadedSections.value.delete('todays-tasks')
    loadedSections.value.delete('all-tasks')
  }

  function reloadCurrentTaskSection() {
    invalidateTaskSections()
    if (activeSection.value === 'todays-tasks') {
      loadSectionData('todays-tasks')
    }
    else if (activeSection.value === 'all-tasks') {
      loadSectionData('all-tasks')
    }
  }

  // --- Task mutations ---

  async function addTask(taskData) {
    await createTask(getToken(), teamId.value, {
      team_id: teamId.value,
      ...taskData,
    })
    reloadCurrentTaskSection()
  }

  async function editTask(taskId, taskData) {
    await updateTask(getToken(), taskId, taskData, teamId.value)
    reloadCurrentTaskSection()
  }

  async function removeTask(taskId) {
    await deleteTask(getToken(), taskId, teamId.value)
    reloadCurrentTaskSection()
  }

  // --- Team mutations ---

  async function updateTeamName(name) {
    updatingTeam.value = true
    updateTeamError.value = ''

    try {
      await updateTeamApi(getToken(), teamId.value, { name })
      teamName.value = name
    }
    catch (err) {
      console.error('Failed to update team', err)
      updateTeamError.value = err?.message || 'Unable to update team. Please try again.'
      throw err
    }
    finally {
      updatingTeam.value = false
    }
  }

  async function removeTeam() {
    deletingTeam.value = true

    try {
      await deleteTeamApi(getToken(), teamId.value)
    }
    catch (err) {
      console.error('Failed to delete team', err)
      throw err
    }
    finally {
      deletingTeam.value = false
    }
  }

  // --- Initialization ---

  function init(id) {
    teamId.value = id
    teamName.value = ''
    tasks.value = []
    todaysTasks.value = []
    members.value = []
    tasksError.value = ''
    updateTeamError.value = ''
    loadedSections.value = new Set()
    loadSectionData(activeSection.value)
  }

  return {
    // State
    teamId,
    teamName,
    activeSection,
    tasks,
    todaysTasks,
    members,
    tasksLoading,
    todaysTasksLoading,
    membersLoading,
    tasksError,
    updatingTeam,
    updateTeamError,
    deletingTeam,

    // Actions
    init,
    loadSectionData,
    reloadCurrentTaskSection,
    addTask,
    editTask,
    removeTask,
    updateTeamName,
    removeTeam,
  }
})
