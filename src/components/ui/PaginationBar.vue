<template>
  <div class="mt-4 flex items-center justify-between text-sm">
    <p class="text-text-secondary">
      총 {{ pagination.total }}개, {{ pagination.page }} / {{ pagination.totalPages }} 페이지
    </p>
    <div class="flex gap-2">
      <button
        type="button"
        :class="styleButton"
        @click="emit('changePage', pagination.page - 1)"
        :disabled="pagination.page === 1"
      >
        이전
      </button>
      <button
        type="button"
        :class="styleButton"
        @click="emit('changePage', pagination.page + 1)"
        :disabled="pagination.totalPages === pagination.page"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaginationMeta } from '@/types/api'

const styleButton = `rounded-md border border-border-strong px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50`
defineProps<{
  pagination: PaginationMeta
}>()
const emit = defineEmits<{
  changePage: [page: number]
}>()
</script>

<style scoped></style>
