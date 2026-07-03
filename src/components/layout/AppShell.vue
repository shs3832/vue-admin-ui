<script setup lang="ts">
import PageHeader from './PageHeader.vue'
import SideBar from './SideBar.vue'
import TopBar from './TopBar.vue'
</script>
<template>
  <div class="min-h-screen bg-bg-page text-text-primary">
    <TopBar />

    <div class="flex min-h-[calc(100vh-56px)] w-full">
      <aside class="w-[220px] shrink-0 border-r border-border bg-bg-surface p-4">
        <SideBar />
      </aside>

      <main class="min-w-0 flex-1 p-6">
        <!-- <PageHeader :title="`test`" :description="`description`" /> -->

        <RouterView />
      </main>
    </div>
  </div>
</template>
<style scoped></style>
