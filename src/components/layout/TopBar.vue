<template>
  <header class="flex h-14 items-center justify-between border-b border-border bg-bg-surface px-6">
    <div>
      <p class="text-base font-bold text-text-primary">Vue Admin UI</p>
      <p class="text-xs text-text-muted">Operations Console</p>
    </div>

    <div class="flex items-center gap-3">
      <div class="text-right">
        <p class="text-sm font-medium text-text-primary">
          {{ authStore.user?.name ?? '관리자' }}
        </p>
        <p class="text-xs text-text-muted">
          {{ authStore.user?.email ?? '-' }}
        </p>
      </div>

      <span :class="roleBadgeStyle">
        {{ authStore.user?.role ?? '-' }}
      </span>

      <button type="button" :class="logoutButtonStyle" @click="logout">로그아웃</button>
    </div>
  </header>
</template>

<script setup lang="ts">
const logoutButtonStyle =
  'rounded-md border border-border-strong px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-bg-muted hover:text-text-primary'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
const authStore = useAuthStore()
const logout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
const roleBadgeStyle = computed(() => {
  const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium'

  if (authStore.user?.role === 'admin') {
    return `${base} bg-blue-50 text-blue-700`
  }

  if (authStore.user?.role === 'manager') {
    return `${base} bg-emerald-50 text-emerald-700`
  }

  return `${base} bg-bg-muted text-text-secondary`
})
</script>

<style scoped></style>
