<template>
  <div class="mt-4 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
    <p class="text-center text-text-secondary sm:text-left">
      총 {{ pagination.total }}개, {{ pagination.page }} / {{ pagination.totalPages }} 페이지
    </p>
    <div class="flex max-w-full justify-center gap-1 overflow-x-auto pb-1 sm:justify-end">
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

const buttonBaseStyle = `inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md border px-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:opacity-50`

const styleButton = `${buttonBaseStyle} cursor-pointer border-border-strong text-text-secondary enabled:hover:bg-bg-muted enabled:hover:text-text-primary`

const activeButtonStyle = `${buttonBaseStyle} cursor-pointer border-primary bg-primary text-white enabled:hover:bg-primary-hover`

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
