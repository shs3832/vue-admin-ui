<template>
  <span
    :class="['inline-flex px-2 py-1 text-xs font-medium rounded-full', statusClassMap[status]]"
    >{{ statusMap[status] }}</span
  >
</template>

<script setup lang="ts">
import type { IUser } from '@/types/users'

const statusMap = {
  active: '활성',
  inactive: '비활성',
  pending: '대기',
}

const statusClassMap = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  pending: 'bg-amber-100 text-amber-700',
}

defineProps<{
  status: IUser['status']
}>()
</script>

<style scoped></style>
