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
        v-for="page in visiblePages"
        :key="page"
        type="button"
        :class="page === pagination.page ? activeButtonStyle : styleButton"
        @click="emit('changePage', page)"
      >
        {{ page }}
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
import { computed } from 'vue'

const styleButton = `rounded-md border border-border-strong px-3 py-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const activeButtonStyle = `${styleButton} bg-primary text-white border-primary`
const props = defineProps<{
  pagination: PaginationMeta
}>()
const emit = defineEmits<{
  changePage: [page: number]
}>()

const visiblePages = computed(() => {
  const maxVisiblePages = 5
  const sidePageCount = Math.floor(maxVisiblePages / 2)

  let firstVisiblePage = props.pagination.page - sidePageCount
  let lastVisiblePage = props.pagination.page + sidePageCount

  if (firstVisiblePage < 1) {
    firstVisiblePage = 1
    lastVisiblePage = Math.min(props.pagination.totalPages, maxVisiblePages)
  }

  if (lastVisiblePage > props.pagination.totalPages) {
    lastVisiblePage = props.pagination.totalPages
    firstVisiblePage = Math.max(1, lastVisiblePage - maxVisiblePages + 1)
  }

  return Array.from(
    { length: lastVisiblePage - firstVisiblePage + 1 },
    (_, index) => firstVisiblePage + index,
  )
})
</script>
