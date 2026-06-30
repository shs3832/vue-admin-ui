<template>
  <article class="rounded-container border border-border bg-bg-surface p-4">
    <p>{{ title }}</p>
    <strong>{{ value }}</strong>
    <p v-if="description">{{ description }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  description?: string
}>()
</script>
