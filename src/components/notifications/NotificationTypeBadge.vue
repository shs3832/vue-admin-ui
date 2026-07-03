<template>
  <span :class="[baseStyle, badgeClass]">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NotificationTypeLabels, NotificationType } from './types'

const props = defineProps<{ type: NotificationType }>()

const baseStyle = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium'
const badgeClassMap: Record<NotificationType, string> = {
  info: 'bg-blue-50 text-blue-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-yellow-50 text-yellow-700',
  error: 'bg-red-50 text-red-700',
}
const labels: NotificationTypeLabels = {
  info: '정보',
  success: '성공',
  warning: '주의',
  error: '오류',
}

const label = computed(() => {
  return labels[props.type]
})

const badgeClass = computed(() => {
  return badgeClassMap[props.type]
})
</script>
