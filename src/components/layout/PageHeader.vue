<template>
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-text-primary">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-1 text-sm text-text-secondary">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
}>()
</script>

<style scoped></style>
