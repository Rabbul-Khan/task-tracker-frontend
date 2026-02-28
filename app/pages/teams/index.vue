<script setup>
import { useTeams } from '#imports'
import { z } from 'zod'

const { getTeams, openModal, closeModal, createTeam, teams, loading, isModalOpen, error, state } = useTeams()

const schema = z.object({
  teamName: z.string().min(3, 'Team name must be at least 3 characters'),
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

async function handleCreateTeam(event) {
  createTeam(event)
}

onMounted(() => {
  getTeams()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-bold">
        Teams
      </h1>
      <UButton
        color="primary"
        size="md"
        label="Create Team"
        icon="i-heroicons-plus"
        class="px-6"
        @click="openModal"
      />
    </div>
    <hr class="border-gray-300 mb-6">
    <!-- <h2 class="text-sm mb-5">
      Here is a list of teams you created
    </h2> -->

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-primary animate-spin" />
    </div>

    <!-- Your teams content goes here -->
    <div v-else class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      <div
        v-for="team in teams"
        :key="team.id"
        class="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 p-5 cursor-pointer group"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 group-hover:text-primary">
            {{ team.name || 'Unnamed Team' }}
          </h2>
          <div
            class="rounded-full bg-blue-50 text-primary text-xs px-3 py-1 font-medium"
          >
            {{ team.membersCount ?? 1 }} {{ (team.membersCount ?? 1) === 1 ? 'Member' : 'Members' }}
          </div>
        </div>

        <!-- Owner -->
        <div class="flex items-center gap-3 mb-4">
          <div
            v-if="team.ownerAvatar"
            class="w-8 h-8 rounded-full overflow-hidden"
          >
            <img
              :src="team.ownerAvatar"
              alt="Owner avatar"
              class="w-full h-full object-cover"
            >
          </div>
          <div
            v-else
            class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <span class="text-primary text-sm font-medium">
              {{ (team.ownerName || 'You').charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-600">
              Owner
            </p>
            <p class="text-sm font-medium text-gray-800">
              {{ team.ownerName || 'You' }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between text-sm text-gray-500">
          <span>{{ team.createdAt ? `Created on ${formatDate(team.createdAt)}` : 'Recently created' }}</span>

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
    <UModal v-model:open="isModalOpen" :ui="{ width: 'sm:max-w-md' }">
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

            <UAlert
              v-if="error"
              color="error"
              variant="soft"
              icon="i-heroicons-exclamation-triangle"
              :title="error"
            />

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
</template>
