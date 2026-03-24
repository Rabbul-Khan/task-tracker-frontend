<script setup>
import { acceptInvitation } from '~/services/teams'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
// eslint-disable-next-line no-undef
const route = useRoute()
// eslint-disable-next-line no-undef
const toast = useToast()

const token = computed(() => route.query.token || '')
const accepting = ref(false)
const accepted = ref(false)
const errorMessage = ref('')

async function handleAcceptInvite() {
  if (!token.value) {
    errorMessage.value = 'Invalid or missing invitation token.'
    return
  }

  accepting.value = true
  accepted.value = false
  errorMessage.value = ''

  try {
    await acceptInvitation(authStore.token, { token: token.value })
    accepted.value = true

    toast.add({
      title: 'Invitation Accepted',
      description: 'You have successfully joined the team.',
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
  }
  catch (error) {
    console.error('Accept invite failed', error)
    errorMessage.value = error?.message || 'Unable to accept invitation. Please try again.'
  }
  finally {
    accepting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900">
          Team Invitation
        </h1>
        <p class="text-gray-600 mt-2">
          You've been invited to join a team. Click below to accept the invitation.
        </p>
      </div>

      <UCard :ui="{ body: { padding: 'p-6 sm:p-8' } }">
        <div v-if="!token" class="space-y-4 text-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10 text-red-400 mx-auto" />
          <p class="text-sm text-gray-600">
            No invitation token found. Please use the link from your invitation email.
          </p>
        </div>

        <div v-else-if="accepted" class="space-y-4 text-center">
          <UIcon name="i-heroicons-check-circle" class="w-10 h-10 text-green-500 mx-auto" />
          <p class="text-lg font-semibold text-gray-900">
            You're in!
          </p>
          <p class="text-sm text-gray-600">
            You have successfully joined the team.
          </p>
          <NuxtLink to="/teams">
            <UButton color="primary" size="lg" class="mt-2 px-8">
              Go to Teams
            </UButton>
          </NuxtLink>
        </div>

        <div v-else class="space-y-6">
          <div class="flex items-center gap-4">
            <UButton
              size="lg"
              color="primary"
              :loading="accepting"
              class="px-8"
              @click="handleAcceptInvite"
            >
              Accept Invitation
            </UButton>
            <NuxtLink to="/teams" class="text-sm text-gray-500 hover:text-gray-700">
              Decline
            </NuxtLink>
          </div>

          <UAlert
            v-if="errorMessage"
            color="error"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            :title="errorMessage"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>
