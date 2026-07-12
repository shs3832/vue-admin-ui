<template>
  <header
    class="flex h-14 items-center justify-between border-b border-border bg-bg-surface px-4 sm:px-6"
  >
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="inline-flex size-9 items-center justify-center rounded-md border border-border-strong text-text-secondary hover:text-text-primary hover:bg-bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring cursor-pointer lg:hidden"
        aria-controls="mobile-navigation"
        :aria-expanded="isMobileMenuOpen"
        :aria-label="isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'"
        @click="emit('toggleMenu')"
        ref="mobileMenuButtonRef"
      >
        <span aria-hidden="true" class="flex size-4 flex-col justify-center gap-1">
          <span class="h-0.5 w-full rounded-full bg-current"></span>
          <span class="h-0.5 w-full rounded-full bg-current"></span>
          <span class="h-0.5 w-full rounded-full bg-current"></span>
        </span>
      </button>
      <div>
        <p class="text-base font-bold text-text-primary">Vue Admin UI</p>
        <p class="text-xs text-text-muted">Operations Console</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <div class="text-right hidden lg:block">
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
const logoutButtonStyle = `rounded-md border border-border-strong px-3 py-1.5 text-sm font-semibold text-text-secondary cursor-pointer transition-colors hover:bg-bg-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring`
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { computed, nextTick, ref, watch } from 'vue'
const mobileMenuButtonRef = ref<HTMLButtonElement | null>(null)
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

const props = defineProps<{
  isMobileMenuOpen: boolean
}>()

const emit = defineEmits<{
  toggleMenu: []
}>()

watch(
  () => props.isMobileMenuOpen,
  async (isOpen) => {
    if (isOpen) return
    await nextTick()
    mobileMenuButtonRef.value?.focus()
  },
)
</script>

<style scoped></style>
