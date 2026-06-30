<template>
  <span :class="['inline-flex px-2 py-1 text-xs font-medium rounded-full', roleClassMap[role]]">{{
    roleMap[role]
  }}</span>
</template>

<script setup lang="ts">
import type { IUser } from './types'

const roleMap = {
  admin: '관리자',
  manager: '매니저',
  editor: '에디터',
}

const roleClassMap = {
  admin: 'bg-blue-100 text-blue-700',
  manager: 'bg-sky-100 text-sky-700',
  editor: 'bg-gray-100 text-gray-700',
}

defineProps<{
  role: IUser['role']
}>()
</script>

<style scoped></style>
