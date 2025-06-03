<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth'
import { onMounted } from 'vue'

const loading = ref(true)

onMounted(() => {
  loading.value = false
  const authStore = useAuthStore()
  authStore.checkAuth()
  if (authStore.isAuthenticated && !authStore.user) {
    authStore.fetchUser()
  }
})
</script>
