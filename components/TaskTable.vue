<script setup>
import { computed } from 'vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
})

// const emit = defineEmits(['create-task'])

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
              ID
            </th>
            <th scope="col" class="px-4 py-3">
              Title
            </th>
            <th scope="col" class="px-4 py-3">
              Status
            </th>
            <th scope="col" class="px-4 py-3">
              Priority
            </th>
            <th scope="col" class="px-4 py-3">
              Assignee
            </th>
            <th scope="col" class="px-4 py-3">
              Category
            </th>
            <th scope="col" class="px-4 py-3">
              Due Date
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 text-sm">
          <tr
            v-for="row in processedRows"
            :key="row.task.id"
            class="bg-white transition-colors hover:bg-gray-50"
          >
            <td class="whitespace-nowrap px-4 py-4 font-mono text-xs text-gray-500">
              {{ row.task.readable_id }}
            </td>
            <td class="max-w-[260px] px-4 py-4">
              <span
                class="block truncate text-sm font-semibold text-gray-900"
                :title="row.task.title"
              >
                {{ row.task.title }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-4">
              <span
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                :class="row.status.classes"
              >
                {{ row.status.label }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-4">
              <div class="flex items-center gap-2 text-sm font-medium" :class="row.priority.classes">
                <!-- <span
                  class="h-4 w-4" :class="[row.priority.icon]"
                  aria-hidden="true"
                /> -->
                <span>{{ row.priority.label }}</span>
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <!-- <div class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
                  <template v-if="row.task.assignee">
                    <img
                      v-if="row.task.assignee.avatar_url"
                      :src="row.task.assignee.avatar_url"
                      :alt="row.task.assignee.name"
                      class="h-9 w-9 rounded-full object-cover"
                    >
                    <span v-else>
                      {{ getInitials(row.task.assignee.name) }}
                    </span>
                  </template>
                  <span v-else class="i-heroicons-user-circle h-6 w-6 text-gray-400" aria-hidden="true" />
                </div> -->
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900">
                    {{ row.task.assignee?.name ?? 'Unassigned' }}
                  </span>
                  <span class="text-xs text-gray-400">
                    {{ row.task.assignee?.email ?? '—' }}
                  </span>
                </div>
              </div>
            </td>
            <td class="whitespace-nowrap px-4 py-4">
              <span class="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                {{ row.task.category }}
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-4">
              <div class="flex items-center gap-2 text-sm font-medium" :class="row.due.classes">
                <!-- <span
                  v-if="row.due.icon"
                  class="h-4 w-4" :class="[row.due.icon]"
                  aria-hidden="true"
                /> -->
                <span>
                  {{ row.due.label }}
                </span>
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
      <span class="i-heroicons-clipboard-document-list h-12 w-12 text-gray-300" aria-hidden="true" />
      <div class="space-y-1">
        <p class="text-lg font-semibold text-gray-700">
          No tasks found
        </p>
        <p class="text-sm text-gray-500">
          Create a task to get this team moving.
        </p>
      </div>
      <UButton color="primary" icon="i-heroicons-plus" @click="handleCreateClick">
        Create Task
      </UButton>
    </div>
  </div>
</template>
