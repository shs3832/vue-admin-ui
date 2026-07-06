<template>
  <div
    class="flex items-center gap-2 rounded-md border border-border bg-bg-surface px-4 py-3 text-sm text-text-secondary"
    role="status"
    aria-live="polite"
  >
    <span
      class="h-4 w-4 animate-spin rounded-full border-2 border-border-strong border-t-primary"
      aria-hidden="true"
    />
    <span>{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: '데이터를 불러오는 중입니다.',
  },
)
</script>

<style scoped></style>
