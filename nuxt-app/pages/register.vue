<template>
  <form @submit.prevent="handleSubmit">
    <input type="email" v-model="credentials.email" placeholder="Email" />
    <input
      type="password"
      v-model="credentials.password"
      placeholder="Password"
    />
    <input
      type="password"
      v-model="credentials.password2"
      placeholder="Confirm Password"
    />
    <button type="submit">Reigster</button>
  </form>
</template>

<script setup>
import { useAuthStore } from '~/store/auth.js'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const authStore = useAuthStore()
const { isAuthenticated } = storeToRefs(authStore)

const credentials = reactive({
  email: "",
  password: "",
  password2: "",
});

const loading = ref(false);
const error = ref(null);

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await register(credentials);
    if (response.error) {
      throw new Error(response.error);
    }
    window.location.href = "/login";
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

watch(
  isAuthenticated,
  (newValue) => {
    if (newValue) {
      router.push('/')
    }
  },
  { immediate: true },
)
</script>