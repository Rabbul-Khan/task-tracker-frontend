<script setup>
// eslint-disable-next-line no-undef
const colorMode = useColorMode()

// Force light mode on this page
colorMode.preference = 'light'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  try {
    loading.value = true
    error.value = ''
    const response = await fetch('http://localhost:8003/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    const data = await response.json()
    if (!response.ok)
      throw new Error(data.message || 'Login failed')
    localStorage.setItem('token', data.token)
    // navigateTo('/dashboard')
  }
  catch (err) {
    error.value = err.message || 'Login failed. Please try again.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-100 items-center justify-center">
    <div class="flex bg-white max-w-[500px] w-full rounded-2xl shadow-sm">
      <div class="flex flex-col justify-center w-full p-8 md:p-16 lg:p-20">
        <!-- Logo -->
        <div class="mb-10 flex items-center gap-2">
          <div class="bg-primary w-8 h-8 flex items-center justify-center rounded-md text-white font-bold">
            T
          </div>
          <span class="text-lg font-semibold text-primary">TaskFlow</span>
        </div>

        <h1 class="text-3xl font-bold text-text-primary mb-2">
          Welcome Back!
        </h1>
        <p class="text-text-secondary mb-8">
          Sign in to access your dashboard and turn your plans into progress with TaskFlow.
        </p>

        <form class="space-y-6 flex flex-col" @submit.prevent="handleLogin">
          <!-- Email -->
          <UFormField label="Email" name="email" :ui="{ label: 'text-text-primary font-medium' }">
            <UInput
              v-model="email"
              type="email"
              placeholder="Enter your email"
              size="lg"
              :disabled="loading"
              class="w-full"
              :ui="{ base: 'bg-surface border-border text-text-primary focus:ring-2 focus:ring-primary' }"
            />
          </UFormField>

          <!-- Password -->
          <UFormField label="Password" name="password" :ui="{ label: 'text-text-primary font-medium' }">
            <UInput
              v-model="password"
              type="password"
              placeholder="Enter your password"
              size="lg"
              :disabled="loading"
              class="w-full"
              :ui="{ base: 'bg-surface border-border text-text-primary focus:ring-2 focus:ring-primary' }"
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

          <!-- Sign In -->
          <UButton
            type="submit"
            size="lg"
            block
            color="primary"
            :loading="loading"
            class="transition-colors duration-300"
          >
            Sign In
          </UButton>

          <!-- OR Divider -->
          <div class="flex items-center gap-3 my-2">
            <div class="h-px bg-border flex-1" />
            <span class="text-text-secondary text-sm">OR</span>
            <div class="h-px bg-border flex-1" />
          </div>

          <!-- Social Buttons -->
          <UButton
            icon="i-logos-google-icon"
            variant="outline"
            size="lg"
            block
            :ui="{ base: 'border-border text-text-secondary hover:bg-slate-100' }"
          >
            Continue with Google
          </UButton>

          <p class="text-center text-sm text-text-secondary">
            Don’t have an account?
            <a href="#" class="text-primary font-medium hover:underline">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
