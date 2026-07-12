<script setup lang="ts">
import PageHeader from './PageHeader.vue'
import SideBar from './SideBar.vue'
import TopBar from './TopBar.vue'

import { ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)
const mobileMenuCloseButtonRef = ref<HTMLButtonElement | null>(null)
const pageTitle = computed(() => {
  return route.meta.title
})
const pageDescription = computed(() => {
  return route.meta.description
})
const handleToggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
const handleCloseMobileMenu = () => {
  isMobileMenuOpen.value = false
}

watch(isMobileMenuOpen, async (isOpen) => {
  if (!isOpen) return
  await nextTick()
  mobileMenuCloseButtonRef.value?.focus()
})
</script>
<template>
  <div class="min-h-screen bg-bg-page text-text-primary" @keydown.esc="handleCloseMobileMenu">
    <TopBar @toggleMenu="handleToggleMobileMenu" :isMobileMenuOpen="isMobileMenuOpen" />
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <button
        type="button"
        class="fixed inset-0 z-40 bg-black/40 lg:hidden"
        tabindex="-1"
        aria-hidden="true"
        v-if="isMobileMenuOpen"
        @click="handleCloseMobileMenu"
      />
    </Transition>
    <Transition
      enter-active-class="transition-transform duration-200 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-150 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        id="mobile-navigation"
        class="fixed inset-y-0 left-0 z-50 flex w-55 flex-col border-r border-border bg-bg-surface lg:hidden"
        aria-label="모바일 메뉴"
        v-if="isMobileMenuOpen"
      >
        <div class="flex h-14 items-center justify-between border-b border-border px-4">
          <p class="text-sm font-semibold text-text-primary">메뉴</p>

          <button
            type="button"
            class="inline-flex size-9 items-center justify-center rounded-md text-text-secondary hover:bg-bg-muted hover:text-text-primary focus-visible:outline-2 cursor-pointer focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            aria-label="메뉴 닫기"
            @click="handleCloseMobileMenu"
            ref="mobileMenuCloseButtonRef"
          >
            <span aria-hidden="true" class="relative size-4">
              <span
                class="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-current"
              />
              <span
                class="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current"
              />
            </span>
          </button>
        </div>

        <div class="p-4">
          <SideBar @navigate="handleCloseMobileMenu" />
        </div>
      </aside>
    </Transition>
    <div class="flex min-h-[calc(100vh-56px)] w-full">
      <aside class="hidden w-55 shrink-0 border-r border-border bg-bg-surface p-4 lg:block">
        <SideBar />
      </aside>

      <main class="min-w-0 flex-1 p-4 md:p-5 lg:p-6">
        <PageHeader v-if="pageTitle" :title="pageTitle" :description="pageDescription" />

        <RouterView />
      </main>
    </div>
  </div>
</template>
