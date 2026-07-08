<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    @keydown.esc="emit('cancel')"
  >
    <div
      class="w-full max-w-sm rounded-md border border-border bg-white p-5 shadow-lg"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="descriptionId"
    >
      <div>
        <h2 class="text-base font-semibold text-text-primary" :id="titleId">{{ title }}</h2>
        <p class="mt-2 text-sm text-text-secondary" :id="descriptionId">{{ description }}</p>
      </div>
      <div class="mt-5 flex justify-end gap-2">
        <button
          ref="cancelButtonRef"
          type="button"
          class="rounded-md border border-border-strong px-4 py-2 text-sm"
          @click="emit('cancel')"
        >
          취소
        </button>
        <button
          type="button"
          class="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white"
          @click="emit('confirm')"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, useId } from 'vue'

const props = defineProps<{
  open: boolean
  title: string
  description: string
}>()
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const titleId = useId()
const descriptionId = useId()

const cancelButtonRef = ref<HTMLButtonElement | null>(null)

watch(
  () => props.open,

  async (isOpen) => {
    if (!isOpen) return

    await nextTick()
    cancelButtonRef.value?.focus()
  },
)
</script>
