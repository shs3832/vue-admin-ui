<template>
  <nav>
    <ul class="space-y-1">
      <li>
        <RouterLink to="/dashboard" :class="linkStyle"> Dashboard </RouterLink>
      </li>
      <li>
        <RouterLink to="/users" :class="linkStyle"> Users </RouterLink>
      </li>
      <li>
        <RouterLink to="/products" :class="linkStyle"> Products </RouterLink>
      </li>
      <li>
        <RouterLink to="/notifications" :class="linkStyle"> Notifications </RouterLink>
      </li>
      <li>
        <RouterLink to="/activity-logs" :class="linkStyle"> Activity Logs </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const activeLinkStyle = 'bg-bg-muted text-text-primary'
const linkStyle =
  'block rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-muted hover:text-text-primary'
</script>

<style scoped>
.router-link-active {
  background-color: #f3f4f6;
  color: #111827;
}
</style>
