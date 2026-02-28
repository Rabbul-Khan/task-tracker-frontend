<script setup>
import { useRoute } from '#imports'
import { computed, reactive, ref } from 'vue'
import { z } from 'zod'
import TaskTable from '~/components/TaskTable.vue'
import { getTasksByTeam } from '~/services/tasks'

const BASE_URL = 'http://localhost:8003/api'

const route = useRoute()

const loading = ref(false)
const errorMessage = ref('')
const tasks = ref([])

const teamId = computed(() => Number(route.params.id))

const teamName = computed(() => {
  return Number.isNaN(teamId.value) ? 'Team' : `Team #${teamId.value}`
})

function getToken() {
  if (import.meta.client) {
    return localStorage.getItem('token')
  }
  return null
}

async function loadTasks() {
  const id = teamId.value
  if (!Number.isFinite(id)) {
    tasks.value = []
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const data = await getTasksByTeam(getToken(), id)
    tasks.value = data.data ?? []
  }
  catch (err) {
    console.error('Failed to load tasks', err)
    errorMessage.value = err?.message || 'Unable to load tasks right now. Please try again shortly.'
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTasks()
})

const addTaskModalOpen = ref(false)
const addingTask = ref(false)
const taskError = ref('')
// eslint-disable-next-line no-undef
const toast = useToast()

const addTaskSchema = z.object({
  task: z.string({ required_error: 'Task is required' }).min(1, 'Task is required'),
})

const taskState = reactive({
  task: '',
})

function openAddTaskModal() {
  addTaskModalOpen.value = true
}

async function handleAddTaskSubmit() {
  addingTask.value = true
  taskError.value = ''

  const token = localStorage.getItem('token')
  if (!token) {
    taskError.value = 'Missing authentication token. Please sign in again.'
    addingTask.value = false
    return
  }

  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        team_id: teamId.value,
        title: taskState.task,
        category: 'Feature',
      }),
      redirect: 'manual',
    })

    if (!response.ok) {
      throw new Error('Failed to add task')
    }

    taskState.task = ''
    addTaskModalOpen.value = false

    toast.add({
      title: 'Task Added',
      description: 'Your new task has been added successfully.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })

    // Reload tasks after adding
    await loadTasks()
  }
  catch (error) {
    console.error('Adding task failed', error)
    const redirectMessage = error?.response?.status === 302
      ? 'Add task request was redirected. Verify API base URL and CORS settings.'
      : null
    const serverMessage = redirectMessage
      || error?.data?.message
      || error?.message
      || 'Unable to add task. Please try again.'
    taskError.value = serverMessage
  }
  finally {
    addingTask.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ teamName }}
        </h1>
      </div>

      <div class="flex items-center gap-4 self-start md:self-auto">
        <UButton
          color="primary"
          size="md"
          icon="i-heroicons-plus"
          class="px-5"
          :disabled="addingTask"
          @click="openAddTaskModal"
        >
          Add Task
        </UButton>
      </div>
    </div>

    <hr class="border-gray-300 mb-6">

    <UAlert
      v-if="errorMessage"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      :title="errorMessage"
    />

    <div v-if="loading" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="space-y-4">
        <div v-for="index in 6" :key="index" class="h-4 w-full animate-pulse rounded bg-gray-100" />
      </div>
    </div>

    <div v-else>
      <TaskTable :tasks="tasks" />
    </div>

    <UModal
      v-if="addTaskModalOpen" v-model:open="addTaskModalOpen"
      class="max-w-[600px]"
      :ui="{ width: 'sm:max-w-md' }"
      title="Add Task" description="Add a new task for today"
    >
      <template #body>
        <UForm
          :schema="addTaskSchema"
          :state="taskState"
          class="space-y-6"
          :validate-on="['change', 'input']"
          @submit="handleAddTaskSubmit"
        >
          <UFormField label="Task" name="task" :ui="{ label: 'text-text font-medium' }">
            <UInput
              v-model="taskState.task"
              type="text"
              placeholder="What needs to be done today?"
              size="lg"
              :disabled="addingTask"
              class="w-full"
              :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
              autofocus
            />
          </UFormField>

          <UButton
            type="submit"
            size="lg"
            color="primary"
            :loading="addingTask"
            class="px-8"
          >
            Add Task
          </UButton>

          <UAlert
            v-if="taskError"
            color="error"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            :title="taskError"
          />
        </UForm>
      </template>
    </UModal>
  </div>
</template>
