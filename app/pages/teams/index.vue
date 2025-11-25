<script setup>
import { z } from 'zod'

const teams = [
  {
    id: 1,
    name: 'Design Squad',
    ownerName: 'Alice Johnson',
    ownerAvatar: 'https://i.pravatar.cc/100?img=1',
    createdAt: '2024-10-12',
    membersCount: 8,
  },
  {
    id: 2,
    name: 'Backend Ninjas',
    ownerName: 'John Doe',
    ownerAvatar: 'https://i.pravatar.cc/100?img=2',
    createdAt: '2024-11-03',
    membersCount: 5,
  },
  {
    id: 3,
    name: 'Frontend Force',
    ownerName: 'Emma Wilson',
    ownerAvatar: 'https://i.pravatar.cc/100?img=3',
    createdAt: '2024-11-15',
    membersCount: 6,
  },
  {
    id: 4,
    name: 'DevOps Warriors',
    ownerName: 'Michael Chen',
    ownerAvatar: 'https://i.pravatar.cc/100?img=4',
    createdAt: '2024-10-28',
    membersCount: 4,
  },
  {
    id: 5,
    name: 'QA Champions',
    ownerName: 'Sarah Martinez',
    ownerAvatar: 'https://i.pravatar.cc/100?img=5',
    createdAt: '2024-11-20',
    membersCount: 7,
  },
]

const isModalOpen = ref(false)
const loading = ref(false)

const schema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters'),
})

const state = reactive({
  teamName: undefined,
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function openModal() {
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  state.teamName = undefined
}

async function handleCreateTeam(event) {
  loading.value = true
  // TODO: Implement team creation logic
  // eslint-disable-next-line no-console
  console.log('Creating team:', event.data.teamName)

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  loading.value = false
  closeModal()
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-bold">
        Teams
      </h1>
      <UModal>
        <UButton
          color="primary"
          size="md"
          label="Create Team"
          icon="i-heroicons-plus"
          class="px-6"
          @click="openModal"
        />
        <template #content>
          <UCard
            :ui="{
              body: { padding: 'p-6 sm:p-8' },
              header: { padding: 'px-6 pt-6 sm:px-8 sm:pt-8' },
              footer: { padding: 'px-6 pb-6 sm:px-8 sm:pb-8' },
            }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="text-2xl font-bold text-text">
                  Create New Team
                </h3>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark-20-solid"
                  class="-my-1"
                  @click="closeModal"
                />
              </div>
            </template>

            <UForm :schema="schema" :state="state" class="space-y-6" :validate-on="['change', 'input']" @submit="handleCreateTeam">
              <UFormField label="Team Name" name="teamName" :ui="{ label: 'text-text font-medium' }">
                <UInput
                  v-model="state.teamName"
                  type="text"
                  placeholder="Enter team name"
                  size="lg"
                  :disabled="loading"
                  class="w-full"
                  :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
                  autofocus
                />
              </UFormField>

              <div class="flex justify-end gap-3 pt-2">
                <UButton
                  type="button"
                  size="lg"
                  color="error"
                  variant="outline"
                  block
                  class="w-28"
                  :disabled="loading"
                  @click="closeModal"
                >
                  Cancel
                </UButton>
                <UButton
                  type="submit"
                  size="lg"
                  color="primary"
                  block
                  class="w-28"
                  :loading="loading"
                >
                  Create Team
                </UButton>
              </div>
            </UForm>
          </UCard>
        </template>
      </UModal>
    </div>
    <hr class="border-gray-300 mb-6">
    <!-- <h2 class="text-sm mb-5">
      Here is a list of teams you created
    </h2> -->
    <!-- Your teams content goes here -->
    <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <div
        v-for="team in teams"
        :key="team.id"
        class="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 p-5 cursor-pointer group"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 group-hover:text-primary">
            {{ team.name }}
          </h2>
          <div
            class="rounded-full bg-blue-50 text-primary text-xs px-3 py-1 font-medium"
          >
            {{ team.membersCount }} Members
          </div>
        </div>

        <!-- Owner -->
        <div class="flex items-center gap-3 mb-4">
          <img
            :src="team.ownerAvatar"
            alt="Owner avatar"
            class="w-8 h-8 rounded-full object-cover"
          >
          <div>
            <p class="text-sm text-gray-600">
              Owner
            </p>
            <p class="text-sm font-medium text-gray-800">
              {{ team.ownerName }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>Created on {{ formatDate(team.createdAt) }}</span>

          <ULink
            :to="`/teams/${team.id}`"
            class="flex items-center gap-1 text-primary font-medium hover:underline"
          >
            <span>View team</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </ULink>
        </div>
      </div>
    </div>

    <!-- Create Team Modal -->
    <UModal v-model="isModalOpen" :ui="{ width: 'sm:max-w-md' }" />
  </div>
</template>
