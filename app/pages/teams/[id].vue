<script setup>
import { useRoute } from '#imports'
import { computed, reactive, ref, watch } from 'vue'
import { z } from 'zod'
import TaskTable from '../../../components/TaskTable.vue'

const BASE_URL = 'http://localhost:8003/api'

const route = useRoute()

const loading = ref(false)
const errorMessage = ref('')
const tasks = ref([])
const lastRefreshedAt = ref(null)

const teamId = computed(() => Number(route.params.id))

const mockTaskDatabase = {
  1: [
    {
      team_id: 1,
      title: 'Implement Amadeus resissue',
      category: 'Feature',
      // assignee: {
      //   id: 'u1',
      //   name: 'Asif Hayat',
      //   email: 'asif@gmail.com',
      //   avatar_url: 'https://i.pravatar.cc/150?u=asif',
      // },
    },
    {
      team_id: 1,
      title: 'Implement Amadeus rebook',
      category: 'Feature',
      // assignee: {
      //   id: 'u1',
      //   name: 'Asif Hayat',
      //   email: 'asif@gmail.com',
      //   avatar_url: 'https://i.pravatar.cc/150?u=asif',
      // },
    },
    {
      team_id: 1,
      title: 'Implement Farelogix resissue',
      category: 'Feature',
      // assignee: {
      //   id: 'u1',
      //   name: 'Asif Hayat',
      //   email: 'asif@gmail.com',
      //   avatar_url: 'https://i.pravatar.cc/150?u=asif',
      // },
    },
  ],
  2: [
    {
      team_id: 2,
      title: 'Design Amadeus resissue',
      category: 'Feature',
      // assignee: {
      //   id: 'u1',
      //   name: 'Asif Hayat',
      //   email: 'asif@gmail.com',
      //   avatar_url: 'https://i.pravatar.cc/150?u=asif',
      // },
    },
    {
      team_id: 2,
      title: 'Design Amadeus rebook',
      category: 'Feature',
      // assignee: {
      //   id: 'u1',
      //   name: 'Asif Hayat',
      //   email: 'asif@gmail.com',
      //   avatar_url: 'https://i.pravatar.cc/150?u=asif',
      // },
    },
    {
      team_id: 2,
      title: 'Design Farelogix resissue',
      category: 'Feature',
      // assignee: {
      //   id: 'u1',
      //   name: 'Asif Hayat',
      //   email: 'asif@gmail.com',
      //   avatar_url: 'https://i.pravatar.cc/150?u=asif',
      // },
    },
  ],
}

const mockTeams = {
  1: {
    name: 'Design Squad',
    description: 'Designers focused on crafting delightful experiences and validating UX improvements.',
  },
  2: {
    name: 'Backend Ninjas',
    description: 'API and infrastructure engineers keeping the platform fast, stable, and secure.',
  },
  3: {
    name: 'Frontend Force',
    description: 'Frontend specialists delivering polished, performant interfaces across the product.',
  },
}

const teamMeta = computed(() => mockTeams[teamId.value] ?? null)

const teamName = computed(() => {
  if (teamMeta.value?.name) {
    return teamMeta.value.name
  }
  return Number.isNaN(teamId.value) ? 'Team' : `Team #${teamId.value}`
})

let activeRequestToken = 0

async function loadTasks(id) {
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) {
    tasks.value = []
    return
  }

  const requestToken = ++activeRequestToken
  loading.value = true
  errorMessage.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 350))

    const data = mockTaskDatabase[numericId] ?? []
    if (activeRequestToken !== requestToken) {
      return
    }

    tasks.value = data.map(task => ({
      ...task,
      assignee: task.assignee ? { ...task.assignee } : null,
    }))
    lastRefreshedAt.value = new Date()
  }
  catch (error) {
    console.error('Failed to load tasks', error)
    if (activeRequestToken === requestToken) {
      errorMessage.value = 'Unable to load tasks right now. Please try again shortly.'
    }
  }
  finally {
    if (activeRequestToken === requestToken) {
      loading.value = false
    }
  }
}

watch(teamId, (id) => {
  loadTasks(id)
}, { immediate: true })

const addTaskModalOpen = ref(false)
const addingTask = ref(false)
const taskError = ref('')
const taskAddSuccess = ref(false)

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
  taskAddSuccess.value = false

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

    taskAddSuccess.value = true
    taskState.task = ''

    // Reload tasks after adding
    await loadTasks(teamId.value)
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
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            v-if="taskAddSuccess"
            color="success"
            variant="soft"
            icon="i-heroicons-check-circle"
            title="Task Added"
            description="Added new task."
          />

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
