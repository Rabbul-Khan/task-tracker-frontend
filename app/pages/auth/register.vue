<script setup>
import { useAuth } from '#imports'
import { z } from 'zod'
// eslint-disable-next-line no-undef
const colorMode = useColorMode()

// Temporary - force light mode on this page
colorMode.preference = 'light'

const schema = z.object({
  name: z.string(),
  email: z.email('Invalid email address'),
  password: z.string('Password is required').min(8, 'Password must be at least 8 characters'),
})

const state = reactive({
  name: '',
  email: '',
  password: '',
})

const { login, error, loading } = useAuth()

async function handleLogin(event) {
  await login(event.data.email, event.data.password)
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

      <UForm :schema="schema" :state="state" class="space-y-6 flex flex-col" :validate-on="['change', 'input']" @submit="handleLogin">
        <!-- Name -->
        <UFormField label="Name" name="name" :ui="{ label: 'text-text font-medium' }">
          <UInput
            v-model="state.name"
            type="name"
            placeholder="Enter your full name"
            size="lg"
            :disabled="loading"
            class="w-full"
            :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
            autofocus
          />
        </UFormField>
        <!-- Email -->
        <UFormField label="Email" name="email" :ui="{ label: 'text-text font-medium' }">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="Enter your email"
            size="lg"
            :disabled="loading"
            class="w-full"
            :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
          />
        </UFormField>

        <!-- Password -->
        <UFormField label="Password" name="password" :ui="{ label: 'text-text font-medium' }">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Enter your password"
            size="lg"
            :disabled="loading"
            class="w-full"
            :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
          />
        </UFormField>

        <!-- Confirm Password -->
        <UFormField label="Confirm Password" name="password" :ui="{ label: 'text-text font-medium' }">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Confirm your password"
            size="lg"
            :disabled="loading"
            class="w-full"
            :ui="{ base: 'bg-[#F9FBFE] border-border text-text focus:ring-2 focus:ring-primary' }"
          />
        </UFormField>

        <div class="text-right text-sm">
          <a href="#" class="text-primary hover:underline">Forgot Password?</a>
        </div>

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
          class="transition-colors duration-300 cursor-pointer"
          label="Sign In"
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
