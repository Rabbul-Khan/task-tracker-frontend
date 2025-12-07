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

const mockTaskDatabase = {
  1: [
    {
      id: '1',
      readable_id: 'TSK-101',
      title: 'Fix login page CSS overflow on mobile devices',
      description: 'Login button hidden on iPhone SE',
      status: 'in_progress',
      priority: 'high',
      category: 'bugfix',
      due_date: '2024-10-14T00:00:00Z',
      assignee: {
        id: 'u1',
        name: 'Asif Hayat',
        email: 'asif@gmail.com',
        avatar_url: 'https://i.pravatar.cc/150?u=asif',
      },
      created_at: '2024-10-10T09:00:00Z',
    },
    {
      id: '2',
      readable_id: 'TSK-102',
      title: 'Integrate Stripe Payment Gateway',
      description: null,
      status: 'todo',
      priority: 'critical',
      category: 'feature',
      due_date: '2025-10-20T00:00:00Z',
      assignee: {
        id: 'u2',
        name: 'Sarah Jenkins',
        email: 'sarah@example.com',
        avatar_url: 'https://i.pravatar.cc/150?u=sarah',
      },
      created_at: '2024-10-11T14:30:00Z',
    },
    {
      id: '3',
      readable_id: 'TSK-104',
      title: 'Research competitors',
      description: null,
      status: 'done',
      priority: 'low',
      category: 'research',
      due_date: null,
      assignee: {
        id: 'u3',
        name: 'Mike Ross',
        email: 'mike@example.com',
        avatar_url: null,
      },
      created_at: '2024-09-28T09:15:00Z',
    },
  ],
  2: [
    {
      id: '21',
      readable_id: 'TSK-220',
      title: 'API latency investigation',
      description: 'Trace slow query path impacting dashboard response times.',
      status: 'review',
      priority: 'critical',
      category: 'maintenance',
      due_date: '2025-12-01T00:00:00Z',
      assignee: {
        id: 'u4',
        name: 'Devon Miles',
        email: 'devon@example.com',
        avatar_url: 'https://i.pravatar.cc/150?u=devon',
      },
      created_at: '2025-11-10T15:45:00Z',
    },
    {
      id: '22',
      readable_id: 'TSK-221',
      title: 'Implement Auth0 integration',
      description: null,
      status: 'in_progress',
      priority: 'medium',
      category: 'feature',
      due_date: '2025-12-14T00:00:00Z',
      assignee: {
        id: 'u5',
        name: 'Linh Tran',
        email: 'linh@example.com',
        avatar_url: 'https://i.pravatar.cc/150?u=linh',
      },
      created_at: '2025-11-18T10:20:00Z',
    },
    {
      id: '23',
      readable_id: 'TSK-222',
      title: 'Automate nightly backups',
      description: 'Set up new backup pipeline in AWS.',
      status: 'todo',
      priority: 'low',
      category: 'maintenance',
      due_date: '2026-01-05T00:00:00Z',
      assignee: null,
      created_at: '2025-11-05T08:05:00Z',
    },
    {
      id: '24',
      readable_id: 'TSK-223',
      title: 'Postmortem: release 2.4',
      description: 'Document findings and share with stakeholders.',
      status: 'done',
      priority: 'medium',
      category: 'quality',
      due_date: '2025-11-20T00:00:00Z',
      assignee: {
        id: 'u6',
        name: 'Priya Patel',
        email: 'priya@example.com',
        avatar_url: null,
      },
      created_at: '2025-11-02T12:10:00Z',
    },
  ],
  3: [
    {
      id: '31',
      readable_id: 'TSK-301',
      title: 'Component library audit',
      description: null,
      status: 'review',
      priority: 'medium',
      category: 'improvement',
      due_date: '2025-12-10T00:00:00Z',
      assignee: {
        id: 'u7',
        name: 'Amelia Chen',
        email: 'amelia@example.com',
        avatar_url: 'https://i.pravatar.cc/150?u=amelia',
      },
      created_at: '2025-11-12T09:40:00Z',
    },
    {
      id: '32',
      readable_id: 'TSK-302',
      title: 'Convert forms to Composition API',
      description: 'Migrate legacy form logic to Composition API patterns.',
      status: 'in_progress',
      priority: 'high',
      category: 'refactor',
      due_date: '2026-01-15T00:00:00Z',
      assignee: {
        id: 'u8',
        name: 'Jacob Miller',
        email: 'jacob@example.com',
        avatar_url: 'https://i.pravatar.cc/150?u=jacob',
      },
      created_at: '2025-11-25T11:25:00Z',
    },
    {
      id: '33',
      readable_id: 'TSK-303',
      title: 'QA smoke suite expansion',
      description: null,
      status: 'todo',
      priority: 'low',
      category: 'quality',
      due_date: '2025-12-18T00:00:00Z',
      assignee: {
        id: 'u9',
        name: 'Daniel Ortega',
        email: 'daniel@example.com',
        avatar_url: null,
      },
      created_at: '2025-11-15T07:55:00Z',
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

const teamId = computed(() => Number(route.params.id))

const teamMeta = computed(() => mockTeams[teamId.value] ?? null)

const teamName = computed(() => {
  if (teamMeta.value?.name) {
    return teamMeta.value.name
  }
  return Number.isNaN(teamId.value) ? 'Team' : `Team #${teamId.value}`
})

const lastRefreshedLabel = computed(() => {
  if (!lastRefreshedAt.value) {
    return ''
  }
  return lastRefreshedAt.value.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
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

const inviteModalOpen = ref(false)
const inviteSending = ref(false)
const inviteError = ref('')
const inviteSuccess = ref(false)
const lastInvitedEmail = ref('')

const inviteSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Enter a valid email address'),
})

const inviteState = reactive({
  email: '',
})

function openInviteModal() {
  inviteModalOpen.value = true
}

async function handleInviteSubmit({ data }) {
  inviteSending.value = true
  inviteError.value = ''
  inviteSuccess.value = false

  const { email } = data
  const targetTeamId = Number(teamId.value)

  if (!Number.isFinite(targetTeamId)) {
    inviteError.value = 'Invalid team information. Refresh and try again.'
    inviteSending.value = false
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    inviteError.value = 'Missing authentication token. Please sign in again.'
    inviteSending.value = false
    return
  }

  try {
    await fetch(`${BASE_URL}/teams/invite`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        team_id: targetTeamId,
        email,
      }),
      redirect: 'manual',
    })
    inviteSuccess.value = true
    lastInvitedEmail.value = email
    inviteState.email = ''
  }
  catch (error) {
    console.error('Invite failed', error)
    const redirectMessage = error?.response?.status === 302
      ? 'Invite request was redirected. Verify API base URL and CORS settings.'
      : null
    const serverMessage = redirectMessage
      || error?.data?.message
      || error?.message
      || 'Unable to send invite. Please try again.'
    inviteError.value = serverMessage
  }
  finally {
    inviteSending.value = false
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
        <div v-if="lastRefreshedLabel" class="text-sm text-gray-400">
          Updated {{ lastRefreshedLabel }}
        </div>
      </div>

      <div class="flex items-center gap-4 self-start md:self-auto">
        <UButton
          color="primary"
          size="md"
          icon="i-heroicons-envelope-open"
          class="px-5"
          :disabled="inviteSending"
          @click="openInviteModal"
        >
          Invite teammate
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
      v-if="inviteModalOpen" v-model:open="inviteModalOpen"
      class="max-w-[600px]"
      :ui="{ width: 'sm:max-w-md' }"
      title="Invite teammate" description="Share a one-time invite link with someone who should join this team."
    >
      <template #body>
        <UForm
          :schema="inviteSchema"
          :state="inviteState"
          class="space-y-6"
          :validate-on="['change', 'input']"
          @submit="handleInviteSubmit"
        >
          <UFormField label="Email address" name="email" :ui="{ label: 'text-text font-medium' }">
            <UInput
              v-model="inviteState.email"
              type="email"
              placeholder="member@company.com"
              size="lg"
              :disabled="inviteSending"
              class="w-full"
              :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
              autofocus
            />
          </UFormField>

          <UButton
            type="submit"
            size="lg"
            color="primary"
            :loading="inviteSending"
            class="px-8"
          >
            Send invite
          </UButton>

          <UAlert
            v-if="inviteSuccess"
            color="success"
            variant="soft"
            icon="i-heroicons-check-circle"
            title="Invite sent"
            :description="`We emailed a secure link to ${lastInvitedEmail}.`"
          />

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
