<script setup>
import { useAuth } from '#imports'
import { z } from 'zod'
// eslint-disable-next-line no-undef
const colorMode = useColorMode()
colorMode.preference = 'light'

// Validation schema with password confirmation
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const state = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const { register, error, loading } = useAuth()

async function handleRegister(event) {
  await register(event.data.name, event.data.email, event.data.password)
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-100 items-center justify-center">
    <div class="flex bg-white max-w-[500px] w-full rounded-2xl shadow-sm flex-col justify-center p-8 md:p-16 lg:py-14 lg:px-20">
      <!-- Logo -->
      <div class="mb-10 flex items-center gap-2">
        <div class="bg-primary w-8 h-8 flex items-center justify-center rounded-md text-white font-bold">
          T
        </div>
        <span class="text-lg font-semibold text-primary">TaskFlow</span>
      </div>

      <h1 class="text-3xl font-bold text-text mb-2">
        Join TaskFlow!
      </h1>
      <p class="text-text-muted mb-8">
        Create your account to start organizing tasks, tracking progress, and achieving your goals.
      </p>

      <UForm :schema="schema" :state="state" class="space-y-6 flex flex-col" :validate-on="['change', 'input']" @submit="handleRegister">
        <!-- Name -->
        <UFormField label="Full Name" name="name" required :ui="{ label: 'text-text font-medium' }">
          <UInput
            v-model="state.name"
            type="text"
            placeholder="Enter your full name"
            size="lg"
            :disabled="loading"
            autocomplete="name"
            class="w-full"
            :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
            autofocus
          />
        </UFormField>

        <!-- Email -->
        <UFormField label="Email" name="email" required :ui="{ label: 'text-text font-medium' }">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="Enter your email"
            size="lg"
            :disabled="loading"
            autocomplete="email"
            class="w-full"
            :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
          />
        </UFormField>

        <!-- Password -->
        <UFormField label="Password" name="password" required :ui="{ label: 'text-text font-medium' }">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Create a strong password"
            size="lg"
            :disabled="loading"
            autocomplete="new-password"
            class="w-full"
            :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
          />
        </UFormField>

        <!-- Confirm Password -->
        <UFormField label="Confirm Password" name="confirmPassword" required :ui="{ label: 'text-text font-medium' }">
          <UInput
            v-model="state.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            size="lg"
            :disabled="loading"
            autocomplete="new-password"
            class="w-full"
            :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
          />
        </UFormField>

        <!-- Error -->
        <UAlert
          v-if="error"
          color="red"
          variant="soft"
          :title="error"
          icon="i-heroicons-exclamation-triangle"
        />

        <!-- Register Button -->
        <UButton
          type="submit"
          size="lg"
          block
          color="primary"
          :loading="loading"
          :disabled="loading"
          class="transition-colors duration-300"
          label="Create Account"
        />

        <!-- OR Divider -->
        <div class="flex items-center gap-3 my-2">
          <div class="h-px bg-border flex-1" />
          <span class="text-text-muted text-sm">OR</span>
          <div class="h-px bg-border flex-1" />
        </div>

        <!-- Social Buttons -->
        <UButton
          icon="i-logos-google-icon"
          variant="outline"
          size="lg"
          block
          :ui="{ base: 'border-border text-text-muted hover:bg-slate-100 cursor-pointer' }"
        >
          Continue with Google
        </UButton>

        <p class="text-center text-sm text-text-secondary">
          Already have an account?
          <NuxtLink to="/" class="text-primary font-medium hover:underline">
            Sign in here
          </NuxtLink>
        </p>
      </UForm>
    </div>
  </div>
</template>
