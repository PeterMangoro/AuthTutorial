<template>
  <form @submit.prevent="handleSubmit">
    <input type="email" v-model="credentials.email" placeholder="Email" />
    <input
      type="password"
      v-model="credentials.password"
      placeholder="Password"
    />
    <button type="submit">Login</button>
  </form>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "~/store/auth.js";
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore)

const { login } = authStore;

const error = ref(null);
const router = useRouter();

const credentials = reactive({
  email: "",
  password: "",
});

const handleSubmit = async () => {
  try {
    await login(credentials);
    router.push("/");
  } catch (err) {
    error.value = err.message;
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