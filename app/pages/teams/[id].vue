<script setup>
import { useRoute } from '#imports'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { z } from 'zod'
import TaskTable from '~/components/TaskTable.vue'
import { useTeamStore } from '~/stores/team'

// eslint-disable-next-line no-undef
definePageMeta({ layout: 'team' })

const route = useRoute()
const teamStore = useTeamStore()
// eslint-disable-next-line no-undef
const toast = useToast()

const teamId = computed(() => Number(route.params.id))

// Store state bindings
const { tasks, todaysTasks, members, tasksLoading, todaysTasksLoading, membersLoading, tasksError, updatingTeam, updateTeamError, deletingTeam } = storeToRefs(teamStore)
const activeSection = computed({
  get: () => teamStore.activeSection,
  set: val => teamStore.activeSection = val,
})
const teamName = computed({
  get: () => teamStore.teamName,
  set: val => teamStore.teamName = val,
})

// Initialize store when the page mounts
onMounted(() => {
  teamStore.init(teamId.value)
})

watch(activeSection, (section) => {
  teamStore.loadSectionData(section)
})

// --- Modal / UI state (page-local, not in store) ---

const addTaskModalOpen = ref(false)
const addingTask = ref(false)
const taskError = ref('')

const editTaskModalOpen = ref(false)
const editingTask = ref(false)
const editTaskError = ref('')
const editingTaskId = ref(null)
const editTaskState = reactive({
  title: '',
  description: '',
  priority: '',
  category: '',
  status: '',
})

const deleteTaskModalOpen = ref(false)
const deletingTask = ref(false)
const deletingTaskId = ref(null)
const deletingTaskTitle = ref('')
const deleteTeamModalOpen = ref(false)

const editTaskSchema = z.object({
  title: z.string({ required_error: 'Task title is required' }).min(1, 'Task title is required'),
  description: z.string().optional(),
  priority: z.string().optional(),
  category: z.string({ required_error: 'Category is required' }).min(1, 'Category is required'),
  status: z.string().optional(),
})

const addTaskSchema = z.object({
  task: z.string({ required_error: 'Task is required' }).min(1, 'Task is required'),
  description: z.string().optional(),
  priority: z.string().optional(),
  category: z.string({ required_error: 'Category is required' }).min(1, 'Category is required'),
  status: z.string().optional(),
})

const priorityOptions = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

const categoryOptions = [
  { label: 'Feature', value: 'feature' },
  { label: 'Bug Fix', value: 'bug_fix' },
  { label: 'Enhancement', value: 'enhancement' },
]

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In progress', value: 'in progress' },
  { label: 'Completed', value: 'completed' },
]

const taskState = reactive({
  task: '',
  description: '',
  priority: '',
  category: '',
  status: '',
  assigned_to: 'self',
})

function openAddTaskModal() {
  addTaskModalOpen.value = true
}

async function handleAddTaskSubmit() {
  addingTask.value = true
  taskError.value = ''

  try {
    await teamStore.addTask({
      title: taskState.task,
      description: taskState.description || undefined,
      priority: taskState.priority || undefined,
      category: taskState.category,
      status: taskState.status || undefined,
      assigned_to: taskState.assigned_to,
    })

    taskState.task = ''
    taskState.description = ''
    taskState.priority = ''
    taskState.category = ''
    taskState.status = ''
    taskState.assigned_to = 'self'
    addTaskModalOpen.value = false

    toast.add({
      title: 'Task Added',
      description: 'Your new task has been added successfully.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
  }
  catch (error) {
    console.error('Adding task failed', error)
    taskError.value = error?.data?.message || error?.message || 'Unable to add task. Please try again.'
  }
  finally {
    addingTask.value = false
  }
}

function openEditTaskModal(task) {
  editingTaskId.value = task.id
  editTaskState.title = task.title
  editTaskState.description = task.description ?? ''
  editTaskState.priority = task.priority ?? ''
  editTaskState.category = task.category ?? ''
  editTaskState.status = task.status ?? ''
  editTaskError.value = ''
  editTaskModalOpen.value = true
}

async function handleEditTaskSubmit() {
  editingTask.value = true
  editTaskError.value = ''

  try {
    await teamStore.editTask(editingTaskId.value, {
      title: editTaskState.title,
      description: editTaskState.description || undefined,
      priority: editTaskState.priority || undefined,
      category: editTaskState.category,
      status: editTaskState.status || undefined,
    })

    editTaskModalOpen.value = false

    toast.add({
      title: 'Task Updated',
      description: 'The task has been updated successfully.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
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

async function handleInlineUpdateTask({ id, field, value }) {
  try {
    await teamStore.editTask(id, { [field]: value })
  }
  catch (err) {
    console.error('Inline update failed', err)
    toast.add({
      title: 'Update Failed',
      description: err?.message || 'Unable to update task. Please try again.',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
  }
}

async function handleDeleteTask() {
  deletingTask.value = true

  try {
    await teamStore.removeTask(deletingTaskId.value)
    deleteTaskModalOpen.value = false

    toast.add({
      title: 'Task Deleted',
      description: 'The task has been deleted successfully.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
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

async function handleUpdateTeam() {
  if (!teamName.value.trim()) {
    teamStore.updateTeamError = 'Team name is required.'
    return
  }

  try {
    await teamStore.updateTeamName(teamName.value.trim())

    toast.add({
      title: 'Team Updated',
      description: 'The team name has been updated successfully.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
  }
  catch {
    // Error already set in store
  }
}

async function handleDeleteTeam() {
  try {
    await teamStore.removeTeam()

    toast.add({
      title: 'Team Deleted',
      description: 'The team has been deleted successfully.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })

    // eslint-disable-next-line no-undef
    navigateTo('/teams')
  }
  catch (err) {
    console.error('Failed to delete team', err)
    toast.add({
      title: 'Delete Failed',
      description: err?.message || 'Unable to delete team. Please try again.',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle',
    })
  }
}
</script>

<template>
  <div>
    <!-- Today's Tasks -->
    <template v-if="activeSection === 'todays-tasks'">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <h1 class="text-3xl font-bold text-gray-900">
          Today's Tasks
        </h1>
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
      <hr class="border-gray-300 mb-6">

      <div v-if="todaysTasksLoading" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="space-y-4">
          <div v-for="index in 6" :key="index" class="h-4 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
      <div v-else>
        <TaskTable :tasks="todaysTasks" @edit-task="openEditTaskModal" @delete-task="openDeleteTaskModal" @update-task="handleInlineUpdateTask" />
      </div>
    </template>

    <!-- All Tasks -->
    <template v-else-if="activeSection === 'all-tasks'">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <h1 class="text-3xl font-bold text-gray-900">
          All Tasks
        </h1>
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
      <hr class="border-gray-300 mb-6">

      <UAlert
        v-if="tasksError"
        color="error"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        :title="tasksError"
      />

      <div v-if="tasksLoading" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="space-y-4">
          <div v-for="index in 6" :key="index" class="h-4 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
      <div v-else>
        <TaskTable :tasks="tasks" @edit-task="openEditTaskModal" @delete-task="openDeleteTaskModal" @update-task="handleInlineUpdateTask" />
      </div>
    </template>

    <!-- Members -->
    <template v-else-if="activeSection === 'members'">
      <div class="mb-4">
        <h1 class="text-3xl font-bold text-gray-900">
          Members
        </h1>
      </div>
      <hr class="border-gray-300 mb-6">

      <div v-if="membersLoading" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="space-y-4">
          <div v-for="index in 4" :key="index" class="h-4 w-full animate-pulse rounded bg-gray-100" />
        </div>
      </div>
      <div v-else-if="members.length === 0" class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
        <p class="text-lg font-semibold text-gray-700">
          No members found
        </p>
        <p class="text-sm text-gray-500">
          Invite people to join this team.
        </p>
      </div>
      <div v-else class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr class="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th class="px-4 py-3">
                Name
              </th>
              <th class="px-4 py-3">
                Email
              </th>
              <th class="px-4 py-3">
                Role
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 text-sm">
            <tr v-for="member in members" :key="member.id" class="bg-white transition-colors hover:bg-gray-50">
              <td class="px-4 py-4 font-medium text-gray-900">
                {{ member.name }}
              </td>
              <td class="px-4 py-4 text-gray-600">
                {{ member.email }}
              </td>
              <td class="px-4 py-4">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize" :class="member.role === 'owner' ? 'bg-amber-100 text-amber-700' : member.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'">
                  {{ member.role ?? 'member' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- Invitations -->
    <template v-else-if="activeSection === 'invitations'">
      <div class="mb-4">
        <h1 class="text-3xl font-bold text-gray-900">
          Invitations
        </h1>
      </div>
      <hr class="border-gray-300 mb-6">

      <div class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
        <UIcon name="i-heroicons-envelope" class="w-10 h-10 text-gray-400" />
        <p class="text-lg font-semibold text-gray-700">
          Invitations coming soon
        </p>
        <p class="text-sm text-gray-500">
          This section will let you manage team invitations.
        </p>
      </div>
    </template>

    <!-- Issue Tracker -->
    <template v-else-if="activeSection === 'issue-tracker'">
      <div class="mb-4">
        <h1 class="text-3xl font-bold text-gray-900">
          Issue Tracker
        </h1>
      </div>
      <hr class="border-gray-300 mb-6">

      <div class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
        <UIcon name="i-heroicons-bug-ant" class="w-10 h-10 text-gray-400" />
        <p class="text-lg font-semibold text-gray-700">
          Issue tracker coming soon
        </p>
        <p class="text-sm text-gray-500">
          Track and manage issues for this team.
        </p>
      </div>
    </template>

    <!-- Settings -->
    <template v-else-if="activeSection === 'settings'">
      <div class="mb-4">
        <h1 class="text-3xl font-bold text-gray-900">
          Settings
        </h1>
      </div>
      <hr class="border-gray-300 mb-6">

      <div class="space-y-8">
        <!-- Update Team Name -->
        <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">
            Team Name
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            Update the name of your team.
          </p>

          <div class="flex items-end gap-3">
            <div class="flex-1">
              <UInput
                v-model="teamName"
                type="text"
                placeholder="Enter team name"
                size="lg"
                :disabled="updatingTeam"
                class="w-full max-w-md"
              />
            </div>
            <UButton
              color="primary"
              size="lg"
              :loading="updatingTeam"
              class="px-6"
              @click="handleUpdateTeam"
            >
              Save
            </UButton>
          </div>

          <UAlert
            v-if="updateTeamError"
            color="error"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            :title="updateTeamError"
            class="mt-4"
          />
        </div>

        <!-- Delete Team -->
        <div class="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-red-600 mb-1">
            Delete Team
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            Permanently delete this team and all of its data. This action cannot be undone.
          </p>
          <UButton
            color="error"
            variant="soft"
            size="md"
            icon="i-heroicons-trash"
            @click="deleteTeamModalOpen = true"
          >
            Delete Team
          </UButton>
        </div>
      </div>
    </template>

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

          <UFormField label="Description" name="description" :ui="{ label: 'text-text font-medium' }">
            <UTextarea
              v-model="taskState.description"
              placeholder="Add a description..."
              size="lg"
              :disabled="addingTask"
              class="w-full"
              :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Priority" name="priority" :ui="{ label: 'text-text font-medium' }">
              <USelect
                v-model="taskState.priority"
                :items="priorityOptions"
                placeholder="Select priority"
                size="lg"
                :disabled="addingTask"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Category" name="category" :ui="{ label: 'text-text font-medium' }">
              <USelect
                v-model="taskState.category"
                :items="categoryOptions"
                placeholder="Select category"
                size="lg"
                :disabled="addingTask"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Status" name="status" :ui="{ label: 'text-text font-medium' }">
              <USelect
                v-model="taskState.status"
                :items="statusOptions"
                placeholder="Select status"
                size="lg"
                :disabled="addingTask"
                class="w-full"
              />
            </UFormField>
          </div>

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
          <UFormField label="Task" name="title" :ui="{ label: 'text-text font-medium' }">
            <UInput
              v-model="editTaskState.title"
              type="text"
              placeholder="What needs to be done today?"
              size="lg"
              :disabled="editingTask"
              class="w-full"
              :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
              autofocus
            />
          </UFormField>

          <UFormField label="Description" name="description" :ui="{ label: 'text-text font-medium' }">
            <UTextarea
              v-model="editTaskState.description"
              placeholder="Add a description..."
              size="lg"
              :disabled="editingTask"
              class="w-full"
              :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Priority" name="priority" :ui="{ label: 'text-text font-medium' }">
              <USelect
                v-model="editTaskState.priority"
                :items="priorityOptions"
                placeholder="Select priority"
                size="lg"
                :disabled="editingTask"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Category" name="category" :ui="{ label: 'text-text font-medium' }">
              <USelect
                v-model="editTaskState.category"
                :items="categoryOptions"
                placeholder="Select category"
                size="lg"
                :disabled="editingTask"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Status" name="status" :ui="{ label: 'text-text font-medium' }">
              <USelect
                v-model="editTaskState.status"
                :items="statusOptions"
                placeholder="Select status"
                size="lg"
                :disabled="editingTask"
                class="w-full"
              />
            </UFormField>
          </div>

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

    <!-- Delete Team Confirmation Modal -->
    <UModal
      v-if="deleteTeamModalOpen" v-model:open="deleteTeamModalOpen"
      :ui="{ width: 'sm:max-w-sm' }"
      title="Delete Team"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            Are you sure you want to delete this team? All tasks, members, and data associated with this team will be permanently removed.
          </p>
          <p class="text-sm font-medium text-red-600">
            This action cannot be undone.
          </p>

          <div class="flex justify-end gap-3">
            <UButton
              size="lg"
              color="neutral"
              variant="outline"
              class="px-8"
              :disabled="deletingTeam"
              @click="deleteTeamModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              size="lg"
              color="error"
              class="px-8"
              :loading="deletingTeam"
              @click="handleDeleteTeam"
            >
              Delete Team
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
