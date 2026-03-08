<script setup>
import { computed } from 'vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
})

// const emit = defineEmits(['create-task'])
const emit = defineEmits(['editTask', 'deleteTask', 'updateTask'])

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
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
]

function onFieldChange(task, field, value) {
  emit('updateTask', { id: task.id, field, value })
}

const rows = computed(() => props.tasks ?? [])
const hasTasks = computed(() => rows.value.length > 0)

const statusStyles = {
  todo: {
    label: 'To Do',
    classes: 'bg-gray-100 text-gray-700 border border-gray-200',
  },
  in_progress: {
    label: 'In Progress',
    classes: 'bg-sky-100 text-sky-700 border border-sky-200',
  },
  review: {
    label: 'In Review',
    classes: 'bg-violet-100 text-violet-700 border border-violet-200',
  },
  done: {
    label: 'Done',
    classes: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  },
}
const fallbackStatus = {
  label: 'Unknown',
  classes: 'bg-gray-100 text-gray-600 border border-gray-200',
}

const priorityMeta = {
  critical: {
    label: 'Critical',
    classes: 'text-rose-600',
    icon: 'i-heroicons-arrow-up-right',
  },
  high: {
    label: 'High',
    classes: 'text-rose-600',
    icon: 'i-heroicons-arrow-up',
  },
  medium: {
    label: 'Medium',
    classes: 'text-amber-600',
    icon: 'i-heroicons-minus-sm',
  },
  low: {
    label: 'Low',
    classes: 'text-slate-500',
    icon: 'i-heroicons-arrow-down',
  },
}

const fallbackPriority = {
  label: 'None',
  classes: 'text-gray-400',
  icon: 'i-heroicons-minus-circle',
}

function getPriorityMeta(priority) {
  if (!priority || !priorityMeta[priority]) {
    return fallbackPriority
  }
  return priorityMeta[priority]
}

// function getInitials(name) {
//   return name
//     .split(' ')
//     .filter(Boolean)
//     .slice(0, 2)
//     .map(segment => segment[0]?.toUpperCase() ?? '')
//     .join('')
// }

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

function normalizeToDay(date) {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized.getTime()
}

function getDueMeta(dueDate) {
  if (!dueDate) {
    return {
      label: 'No Date',
      classes: 'text-gray-400',
    }
  }

  const parsed = new Date(dueDate)
  if (Number.isNaN(parsed.getTime())) {
    return {
      label: 'No Date',
      classes: 'text-gray-400',
    }
  }

  const today = normalizeToDay(new Date())
  const due = normalizeToDay(parsed)

  if (due < today) {
    return {
      label: dateFormatter.format(parsed),
      classes: 'text-rose-600',
      icon: 'i-heroicons-exclamation-triangle',
    }
  }

  if (due === today) {
    return {
      label: 'Today',
      classes: 'text-amber-600',
    }
  }

  return {
    label: dateFormatter.format(parsed),
    classes: 'text-gray-600',
  }
}

// function handleCreateClick() {
//   emit('create-task')
// }

const processedRows = computed(() => rows.value.map(task => ({
  task,
  status: statusStyles[task.status] ?? fallbackStatus,
  priority: getPriorityMeta(task.priority),
  due: getDueMeta(task.due_date),
})))
</script>

<template>
  <div>
    <div
      v-if="hasTasks"
      class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr class="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th scope="col" class="px-4 py-3">
              Title
            </th>
            <th scope="col" class="px-4 py-3">
              Assigned To
            </th>
            <th scope="col" class="px-4 py-3">
              Category
            </th>
            <th scope="col" class="px-4 py-3">
              Priority
            </th>
            <th scope="col" class="px-4 py-3">
              Status
            </th>
            <th scope="col" class="px-4 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-sm">
          <tr
            v-for="row in processedRows"
            :key="row.task.id"
            class="bg-white transition-colors hover:bg-gray-50"
          >
            <td class="max-w-[260px] px-4 py-4">
              <span
                class="block truncate text-sm font-semibold text-gray-900"
                :title="row.task.title"
              >
                {{ row.task.title }}
              </span>
            </td>

            <td class="whitespace-nowrap px-4 py-4">
              <span class="text-sm text-gray-700">
                {{ row.task.assigned_to ?? '—' }}
              </span>
            </td>

            <td class="whitespace-nowrap px-4 py-4">
              <USelect
                :model-value="row.task.category"
                :items="categoryOptions"
                :ui="{
                  base: 'w-full justify-between bg-transparent hover:bg-gray-100 focus:bg-transparent focus-visible:bg-transparent data-[state=open]:bg-gray-100 rounded',
                  trailingIcon: 'opacity-0 group-hover:opacity-100 transition-opacity',
                }"
                placeholder="Select"
                size="xs"
                class="w-32 cursor-pointer"
                color="neutral" variant="ghost"
                @update:model-value="onFieldChange(row.task, 'category', $event)"
              />
            </td>

            <td class="whitespace-nowrap px-4 py-4">
              <USelect
                :model-value="row.task.priority"
                :items="priorityOptions"
                placeholder="Select"

                size="xs"
                class="w-32 cursor-pointer"
                :ui="{
                  base: 'w-full justify-between bg-transparent hover:bg-gray-100 focus:bg-transparent focus-visible:bg-transparent data-[state=open]:bg-gray-100 rounded',
                  trailingIcon: 'opacity-0 group-hover:opacity-100 transition-opacity',
                }"
                color="neutral" variant="ghost"
                @update:model-value="onFieldChange(row.task, 'priority', $event)"
              />
            </td>

            <td class="whitespace-nowrap px-4 py-4">
              <USelect
                :model-value="row.task.status"
                :items="statusOptions"
                :ui="{
                  base: 'w-full justify-between bg-transparent hover:bg-gray-100 focus:bg-transparent focus-visible:bg-transparent data-[state=open]:bg-gray-100 rounded',
                  trailingIcon: 'opacity-0 group-hover:opacity-100 transition-opacity',
                }"
                placeholder="Select"
                size="xs"
                class="w-32 cursor-pointer"
                color="neutral" variant="ghost"
                @update:model-value="onFieldChange(row.task, 'status', $event)"
              />
            </td>

            <td class="whitespace-nowrap px-4 py-4 text-right">
              <div class="flex items-center justify-end gap-1">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-pencil-square"
                  @click="emit('editTask', row.task)"
                />
                <UButton
                  color="error"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-trash"
                  @click="emit('deleteTask', row.task)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm"
    >
      <div class="space-y-1">
        <p class="text-lg font-semibold text-gray-700">
          No tasks found
        </p>
        <p class="text-sm text-gray-500">
          Create a task to get this team moving.
        </p>
      </div>
    </div>
  </div>
</template>
