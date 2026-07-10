<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
    @keydown.esc="handleCancel"
    :aria-busy="isProcessing"
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

        <div v-if="$slots.default" class="mt-4">
          <slot />
        </div>
      </div>
      <div class="mt-5 flex justify-end gap-2">
        <button
          ref="cancelButtonRef"
          type="button"
          :class="buttonDefaultStyle"
          @click="handleCancel"
          :disabled="isProcessing"
        >
          취소
        </button>
        <button
          type="button"
          :class="[
            confirmButtonStyle,
            confirmVariant === 'danger' ? buttonDangerStyle : buttonPrimaryStyle,
          ]"
          @click="emit('confirm')"
          :disabled="confirmDisabled || isProcessing"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch, useId } from 'vue'
const buttonDefaultStyle = `rounded-md border border-border-strong px-4 py-2 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const confirmButtonStyle = `rounded-md px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const buttonDangerStyle = `bg-red-500`
const buttonPrimaryStyle = `bg-primary hover:bg-primary-hover`
const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    confirmVariant?: 'primary' | 'danger'
    confirmDisabled?: boolean
    isProcessing?: boolean
  }>(),
  {
    confirmLabel: '확인',
    confirmVariant: 'danger',
    confirmDisabled: false,
    isProcessing: false,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const titleId = useId()
const descriptionId = useId()

const cancelButtonRef = ref<HTMLButtonElement | null>(null)
const handleCancel = () => {
  if (props.isProcessing) return

  emit('cancel')
}
watch(
  () => props.open,

  async (isOpen) => {
    if (!isOpen) return

    await nextTick()
    cancelButtonRef.value?.focus()
  },
)
</script>
