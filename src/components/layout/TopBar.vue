<template>
  <div>
    <p>topBar</p>
    <button type="button" @click="logout">로그아웃</button>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const logout = () => {
  authStore.logout()
  router.push(`/login`)
}
</script>

<style scoped></style>
