<script setup>
import { z } from 'zod'

const schema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Enter a valid email address'),
})

const state = reactive({
  email: '',
})

const sending = ref(false)
const inviteSent = ref(false)
const errorMessage = ref('')
const lastInvitedEmail = ref('')

async function handleInvite({ data }) {
  sending.value = true
  inviteSent.value = false
  errorMessage.value = ''

  const { email } = data

  try {
    // TODO: Replace with invite API call when backend is ready.
    await new Promise(resolve => setTimeout(resolve, 600))

    inviteSent.value = true
    lastInvitedEmail.value = email
    state.email = ''
  }
  catch (error) {
    console.error('Invite failed', error)
    errorMessage.value = 'Unable to send invite. Please try again.'
  }
  finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">
        Invite teammates
      </h1>
      <p class="text-gray-600 mt-2">
        Send a one-time invite link to add new members to your workspace.
      </p>
    </div>

    <UCard :ui="{ body: { padding: 'p-6 sm:p-8' } }">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        :validate-on="['change', 'input']"
        @submit="handleInvite"
      >
        <UFormField label="Email address" name="email" :ui="{ label: 'text-text font-medium' }">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="member@company.com"
            size="lg"
            :disabled="sending"
            class="w-full"
            :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
            autofocus
          />
        </UFormField>

        <div class="flex items-center gap-4">
          <UButton
            type="submit"
            size="lg"
            color="primary"
            :loading="sending"
            class="px-8"
          >
            Send invite
          </UButton>
          <span class="text-sm text-gray-500">
            We will email a secure link so they can join your team.
          </span>
        </div>

        <UAlert
          v-if="inviteSent"
          color="success"
          variant="soft"
          icon="i-heroicons-check-circle"
          title="Invite sent"
          :description="`We emailed a secure link to ${lastInvitedEmail}.`"
        />

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :title="errorMessage"
        />
      </UForm>
    </UCard>
  </div>
</template>
