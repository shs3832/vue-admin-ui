<template>
  <div
    class="flex items-start justify-between gap-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm"
    role="alert"
  >
    <div class="flex items-start gap-3">
      <span
        class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700"
        aria-hidden="true"
      >
        !
      </span>

      <div>
        <p class="font-medium text-red-800">요청을 처리하지 못했습니다.</p>
        <p class="mt-1 text-red-700">{{ message }}</p>
      </div>
    </div>

    <button
      type="button"
      class="shrink-0 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium cursor-pointer text-red-700 hover:bg-red-100"
      @click="emit('retry')"
    >
      {{ retryLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    message: string
    retryLabel?: string
  }>(),
  {
    retryLabel: '다시 시도',
  },
)
const emit = defineEmits<{ retry: [] }>()
</script>

<style scoped></style>
