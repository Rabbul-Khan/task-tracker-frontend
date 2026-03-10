<script setup>
import { updateMyProfile } from '~/services/profile'
import { useAuthStore } from '~/stores/auth'

// eslint-disable-next-line no-undef
definePageMeta({
  layout: 'default',
})

const authStore = useAuthStore()

const editing = ref(false)
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')

// Form fields populated from store
const form = reactive({
  name: '',
  email: '',
})

function resetForm() {
  form.name = authStore.user?.name ?? ''
  form.email = authStore.user?.email ?? ''
}

// Fetch profile on mount if not already loaded
onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchProfile()
  }
  resetForm()
})

// Keep form in sync when user data loads
watch(() => authStore.user, () => {
  if (!editing.value) {
    resetForm()
  }
})

function startEditing() {
  resetForm()
  editing.value = true
  saveError.value = ''
  saveSuccess.value = ''
}

function cancelEditing() {
  editing.value = false
  resetForm()
  saveError.value = ''
}

async function saveProfile() {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = ''
  try {
    const result = await updateMyProfile(authStore.token, {
      name: form.name,
      email: form.email,
    })
    authStore.user = result.data ?? result
    editing.value = false
    saveSuccess.value = 'Profile updated successfully'
    setTimeout(() => {
      saveSuccess.value = ''
    }, 2000)
  }
  catch (err) {
    saveError.value = err.message || 'Failed to update profile'
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">
      My Profile
    </h1>
    <hr class="border-gray-300 mb-6">

    <!-- Profile Card -->
    <div class="bg-white rounded-xl border border-gray-200 p-8 mb-4">
      <!-- Avatar + Name header -->
      <div class="flex items-center gap-5 border-gray-100">
        <img
          :src="authStore.user?.avatar || 'https://i.pravatar.cc/100?img=10'"
          alt="User avatar"
          class="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
        >
        <div>
          <h2 class="text-xl font-semibold text-gray-900">
            {{ authStore.user?.name || 'Loading...' }}
          </h2>
          <p class="text-sm text-gray-500">
            {{ authStore.user?.email || '' }}
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 p-8">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">
          Personal Information
        </h2>
        <div class=" flex gap-3">
          <template v-if="editing">
            <UButton
              color="primary"
              :loading="saving"
              size="sm"
              @click="saveProfile"
            >
              Save Changes
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              :disabled="saving"
              size="sm" @click="cancelEditing"
            >
              Cancel
            </UButton>
          </template>
          <UButton
            v-else
            color="primary"
            variant="outline"
            size="sm" @click="startEditing"
          >
            Edit Profile
          </UButton>
        </div>
      </div>
      <!-- Success Alert -->
      <UAlert
        v-if="saveSuccess"
        color="success"
        variant="soft"
        :title="saveSuccess"
        icon="i-heroicons-check-circle"
        class="mb-6 mt-2"
      />

      <!-- Error Alert -->
      <UAlert
        v-if="saveError"
        color="error"
        variant="soft"
        :title="saveError"
        icon="i-heroicons-exclamation-triangle"
        class="mb-6"
      />

      <!-- Profile Fields -->
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-500">Full Name</label>
          <UInput
            v-if="editing"
            v-model="form.name"
            size="lg"
            class="w-full text-sm"
          />
          <p v-else class="text-gray-900 py-2">
            {{ authStore.user?.name || '-' }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-500">Email address</label>
          <UInput
            v-if="editing"
            v-model="form.email"
            type="email"
            size="lg"
            class="w-full text-sm"
          />
          <p v-else class="text-gray-900 py-2">
            {{ authStore.user?.email || '-' }}
          </p>
        </div>
      </div>

      <!-- Actions -->
    </div>
  </div>
</template>
