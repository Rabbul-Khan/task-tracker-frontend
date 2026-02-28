<script setup>
import { useRoute } from '#imports'
import { computed, reactive, ref } from 'vue'
import { z } from 'zod'
import TaskTable from '~/components/TaskTable.vue'
import { deleteTask, getTasksByTeam, updateTask } from '~/services/tasks'
import { inviteToTeam } from '~/services/teams'

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

// Edit task state
const editTaskModalOpen = ref(false)
const editingTask = ref(false)
const editTaskError = ref('')
const editingTaskId = ref(null)
const editTaskState = reactive({
  title: '',
})

const editTaskSchema = z.object({
  title: z.string({ required_error: 'Task title is required' }).min(1, 'Task title is required'),
})

// Delete task state
const deleteTaskModalOpen = ref(false)
const deletingTask = ref(false)
const deletingTaskId = ref(null)
const deletingTaskTitle = ref('')

// Invite member state
const inviteModalOpen = ref(false)
const inviting = ref(false)
const inviteError = ref('')

const inviteSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Please enter a valid email address'),
})

const inviteState = reactive({
  email: '',
})

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

function openEditTaskModal(task) {
  editingTaskId.value = task.id
  editTaskState.title = task.title
  editTaskError.value = ''
  editTaskModalOpen.value = true
}

async function handleEditTaskSubmit() {
  editingTask.value = true
  editTaskError.value = ''

  try {
    await updateTask(getToken(), editingTaskId.value, editTaskState.title)

    editTaskModalOpen.value = false

    toast.add({
      title: 'Task Updated',
      description: 'The task has been updated successfully.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })

    await loadTasks()
  }
  catch (err) {
    console.error('Updating task failed', err)
    editTaskError.value = err?.message || 'Unable to update task. Please try again.'
  }
  finally {
    editingTask.value = false
  }
}

function openDeleteTaskModal(task) {
  deletingTaskId.value = task.id
  deletingTaskTitle.value = task.title
  deleteTaskModalOpen.value = true
}

async function handleDeleteTask() {
  deletingTask.value = true

  try {
    await deleteTask(getToken(), deletingTaskId.value)

    deleteTaskModalOpen.value = false

    toast.add({
      title: 'Task Deleted',
      description: 'The task has been deleted successfully.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })

    await loadTasks()
  }
  catch (err) {
    console.error('Deleting task failed', err)
    toast.add({
      title: 'Delete Failed',
      description: err?.message || 'Unable to delete task. Please try again.',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
  }
  finally {
    deletingTask.value = false
  }
}

function openInviteModal() {
  inviteError.value = ''
  inviteState.email = ''
  inviteModalOpen.value = true
}

async function handleInviteSubmit() {
  inviting.value = true
  inviteError.value = ''

  try {
    await inviteToTeam(getToken(), teamId.value, inviteState.email)

    inviteModalOpen.value = false
    inviteState.email = ''

    toast.add({
      title: 'Invitation Sent',
      description: 'The invitation has been sent successfully.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
  }
  catch (err) {
    console.error('Invite failed', err)
    inviteError.value = err?.message || 'Unable to send invitation. Please try again.'
  }
  finally {
    inviting.value = false
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
          icon="i-heroicons-envelope"
          variant="outline"
          class="px-5"
          @click="openInviteModal"
        >
          Invite Member
        </UButton>
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
      <TaskTable :tasks="tasks" @edit-task="openEditTaskModal" @delete-task="openDeleteTaskModal" />
    </div>

    <UModal
      v-if="addTaskModalOpen" v-model:open="addTaskModalOpen"
      class="max-w-[600px]"
      :ui="{ width: 'sm:max-w-md' }"
      title="Add Task"
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

          <div class="flex justify-end gap-3">
            <UButton
              type="button"
              size="lg"
              color="error"
              variant="outline"
              class="px-8"
              :disabled="addingTask"
              @click="addTaskModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              size="lg"
              color="primary"
              :loading="addingTask"
              class="px-8"
            >
              Add Task
            </UButton>
          </div>

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

    <!-- Edit Task Modal -->
    <UModal
      v-if="editTaskModalOpen" v-model:open="editTaskModalOpen"
      class="max-w-[600px]"
      :ui="{ width: 'sm:max-w-md' }"
      title="Edit Task"
    >
      <template #body>
        <UForm
          :schema="editTaskSchema"
          :state="editTaskState"
          class="space-y-6"
          :validate-on="['change', 'input']"
          @submit="handleEditTaskSubmit"
        >
          <UFormField label="Task Title" name="title" :ui="{ label: 'text-text font-medium' }">
            <UInput
              v-model="editTaskState.title"
              type="text"
              placeholder="Update task title"
              size="lg"
              :disabled="editingTask"
              class="w-full"
              :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
              autofocus
            />
          </UFormField>

          <div class="flex justify-end gap-3">
            <UButton
              type="button"
              size="lg"
              color="error"
              variant="outline"
              class="px-8"
              :disabled="editingTask"
              @click="editTaskModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              size="lg"
              color="primary"
              :loading="editingTask"
              class="px-8"
            >
              Update
            </UButton>
          </div>

          <UAlert
            v-if="editTaskError"
            color="error"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            :title="editTaskError"
          />
        </UForm>
      </template>
    </UModal>

    <!-- Delete Task Confirmation Modal -->
    <UModal
      v-if="deleteTaskModalOpen" v-model:open="deleteTaskModalOpen"
      :ui="{ width: 'sm:max-w-sm' }"
      title="Delete Task"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            Are you sure you want to delete <span class="font-medium text-gray-900">"{{ deletingTaskTitle }}"</span>?
          </p>

          <div class="flex justify-end gap-3">
            <UButton
              size="lg"
              color="neutral"
              variant="outline"
              class="px-8"
              :disabled="deletingTask"
              @click="deleteTaskModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              size="lg"
              color="error"
              class="px-8"
              :loading="deletingTask"
              @click="handleDeleteTask"
            >
              Delete
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Invite Member Modal -->
    <UModal
      v-if="inviteModalOpen" v-model:open="inviteModalOpen"
      class="max-w-[600px]"
      :ui="{ width: 'sm:max-w-md' }"
      title="Invite Member" description="Send an invitation to join this team"
    >
      <template #body>
        <UForm
          :schema="inviteSchema"
          :state="inviteState"
          class="space-y-6"
          :validate-on="['change', 'input']"
          @submit="handleInviteSubmit"
        >
          <UFormField label="Email Address" name="email" :ui="{ label: 'text-text font-medium' }">
            <UInput
              v-model="inviteState.email"
              type="email"
              placeholder="Enter email address"
              size="lg"
              :disabled="inviting"
              class="w-full"
              :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
              autofocus
            />
          </UFormField>

          <div class="flex justify-end gap-3">
            <UButton
              type="button"
              size="lg"
              color="error"
              variant="outline"
              class="px-8"
              :disabled="inviting"
              @click="inviteModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              size="lg"
              color="primary"
              :loading="inviting"
              class="px-8"
            >
              Send Invite
            </UButton>
          </div>

          <UAlert
            v-if="inviteError"
            color="error"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            :title="inviteError"
          />
        </UForm>
      </template>
    </UModal>
  </div>
</template>
