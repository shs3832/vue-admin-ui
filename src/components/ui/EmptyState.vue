<template>
  <div class="rounded-md border border-dashed border-border bg-bg-surface px-6 py-8 text-center">
    <h3 class="mt-3 text-base font-semibold text-text-primary">
      {{ title }}
    </h3>

    <p v-if="description" class="mt-1 text-sm text-text-secondary">
      {{ description }}
    </p>

    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: '데이터를 표시할 수 없습니다.',
  },
)
</script>

<style scoped></style>
