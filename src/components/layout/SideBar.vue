<template>
  <nav>
    <ul class="space-y-1">
      <li v-for="item in navItems" :key="item.to">
        <RouterLink
          :to="item.to"
          :class="[linkStyle, activeMenu === item.activeMenu && activeLinkStyle]"
          @click="emit('navigate')"
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { ActiveMenu } from '@/types/navigation'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

type NavItem = {
  label: string
  to: string
  activeMenu: ActiveMenu
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', activeMenu: 'dashboard' },
  { label: 'Users', to: '/users', activeMenu: 'users' },
  { label: 'Products', to: '/products', activeMenu: 'products' },
  { label: 'Notifications', to: '/notifications', activeMenu: 'notifications' },
  { label: 'Activity Logs', to: '/activity-logs', activeMenu: 'activityLogs' },
  { label: 'Components', to: '/component-preview', activeMenu: 'componentPreview' },
]

const route = useRoute()
const activeMenu = computed(() => route.meta.activeMenu)
const activeLinkStyle = 'bg-bg-muted text-text-primary'
const linkStyle =
  'block rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-muted hover:text-text-primary'
const emit = defineEmits<{
  navigate: []
}>()
</script>
