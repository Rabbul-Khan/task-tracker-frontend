<script setup>
import { useRoute } from '#imports'
import { computed, reactive, ref, watch } from 'vue'
import { z } from 'zod'

const route = useRoute()

const loading = ref(false)
const errorMessage = ref('')
const tasks = ref([])
const lastRefreshedAt = ref(null)

const mockTaskDatabase = {
  1: [
    { team_id: 1, title: '1A ndc bugfix', category: 'bugfix' },
    { team_id: 1, title: 'Prototype analytics dashboard', category: 'feature' },
    { team_id: 1, title: 'Accessibility sweep: marketing site', category: 'improvement' },
    { team_id: 1, title: 'User journey research interviews', category: 'research' },
    { team_id: 3, title: 'Component library audit', category: 'improvement' },
    { team_id: 3, title: 'Convert forms to Composition API', category: 'refactor' },
  ],
  2: [
    { team_id: 2, title: 'API latency investigation', category: 'bugfix' },
    { team_id: 2, title: 'Implement Auth0 integration', category: 'feature' },
    { team_id: 2, title: 'Automate nightly backups', category: 'maintenance' },
    { team_id: 2, title: 'Postmortem: release 2.4', category: 'quality' },
  ],
  3: [
    { team_id: 3, title: 'Component library audit', category: 'improvement' },
    { team_id: 3, title: 'Convert forms to Composition API', category: 'refactor' },
    { team_id: 3, title: 'QA smoke suite expansion', category: 'quality' },
    { team_id: 3, title: 'Content strategy research', category: 'research' },
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

const categoryPalette = {
  bugfix: {
    label: 'Bug Fix',
    chipClass: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: 'i-heroicons-wrench-screwdriver',
  },
  feature: {
    label: 'Feature',
    chipClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'i-heroicons-sparkles',
  },
  improvement: {
    label: 'Improvement',
    chipClass: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'i-heroicons-arrow-trending-up',
  },
  research: {
    label: 'Research',
    chipClass: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: 'i-heroicons-magnifying-glass-circle',
  },
  maintenance: {
    label: 'Maintenance',
    chipClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: 'i-heroicons-cog-6-tooth',
  },
  quality: {
    label: 'Quality Assurance',
    chipClass: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'i-heroicons-clipboard-document-check',
  },
  refactor: {
    label: 'Refactor',
    chipClass: 'bg-violet-50 text-violet-700 border-violet-200',
    icon: 'i-heroicons-arrow-path-rounded-square',
  },
}

function getCategoryMeta(category) {
  return categoryPalette[category] ?? {
    label: 'Uncategorized',
    chipClass: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: 'i-heroicons-tag',
  }
}

const teamId = computed(() => Number(route.params.id))

const teamMeta = computed(() => mockTeams[teamId.value] ?? null)

const teamName = computed(() => {
  if (teamMeta.value?.name) {
    return teamMeta.value.name
  }
  return Number.isNaN(teamId.value) ? 'Team' : `Team #${teamId.value}`
})

// const totalTasks = computed(() => tasks.value.length)

const tasksWithMeta = computed(() => tasks.value.map((task) => {
  const meta = getCategoryMeta(task.category)
  return {
    ...task,
    meta,
  }
}))

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

const isEmptyState = computed(() => !loading.value && !errorMessage.value && tasks.value.length === 0)

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

    tasks.value = data.map((task, index) => ({
      ...task,
      id: `${numericId}-${index + 1}`,
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

// function closeInviteModal() {
//   inviteModalOpen.value = false
//   inviteState.email = ''
//   inviteSending.value = false
//   inviteError.value = ''
//   inviteSuccess.value = false
// }

async function handleInviteSubmit({ data }) {
  inviteSending.value = true
  inviteError.value = ''
  inviteSuccess.value = false

  const { email } = data

  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    inviteSuccess.value = true
    lastInvitedEmail.value = email
    inviteState.email = ''
  }
  catch (error) {
    console.error('Invite failed', error)
    inviteError.value = 'Unable to send invite. Please try again.'
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

    <div v-if="loading" class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <div v-for="index in 4" :key="index" class="h-32 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="h-full w-full animate-pulse rounded-xl bg-gray-100" />
      </div>
    </div>

    <div v-else>
      <div v-if="isEmptyState" class="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
        <p class="mb-2 text-lg font-semibold text-gray-700">
          No tasks added yet
        </p>
        <p class="text-sm text-gray-500">
          Start by creating a task to keep this team on track.
        </p>
      </div>

      <div v-else>
        <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          <UCard
            v-for="task in tasksWithMeta"
            :key="task.id"
            :ui="{ body: { padding: 'p-5' } }"
            class="rounded-2xl border border-gray-200 shadow-sm transition-all duration-200 hover:border-primary/60"
          >
            <div class="flex flex-col gap-3">
              <div class="flex items-start justify-between gap-4">
                <h3 class="text-md font-semibold text-gray-900">
                  {{ task.title }}
                </h3>
                <span
                  class="inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-semibold border"
                  :class="task.meta.chipClass"
                >
                  {{ task.meta.label }}
                </span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
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
