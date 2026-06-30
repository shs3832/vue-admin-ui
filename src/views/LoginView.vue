<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleSubmit">
      <div class="login-email">
        <input type="email" v-model="email" autocomplete="email" />
      </div>
      <div class="login-password">
        <input type="password" v-model="password" autocomplete="current-password" />
      </div>
      <button type="submit" :disabled="isSubmitting">로그인</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)
const authStore = useAuthStore()
const handleSubmit = async () => {
  errorMessage.value = ''
  if (!email.value || !password.value) {
    errorMessage.value = '이메일이나 패스워드를 입력하세요'
    return
  }

  isSubmitting.value = true

  try {
    const body = JSON.stringify({ email: email.value, password: password.value })
    const result = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })

    const responseData = await result.json()

    if (!result.ok) {
      errorMessage.value = responseData.message || '로그인에 실패했습니다.'
      return
    }
    authStore.setAuth(responseData.data.accessToken, responseData.data.user)
    router.push(`/dashboard`)
  } catch (error) {
    errorMessage.value = '로그인 중 에러가 발생했습니다.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped></style>
