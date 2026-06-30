<script setup lang="ts">
import PageHeader from './PageHeader.vue'
import SideBar from './SideBar.vue'
import TopBar from './TopBar.vue'
</script>
<template>
  <div class="bg-bg-page text-text-primary min-h-screen w-full">
    <TopBar />
    <PageHeader :title="`Dashboard`" :description="`관리자 주요 현황을 확인합니다.`" />
    <main class="flex w-full">
      <aside class="w-[200px] p-4">
        <SideBar />
      </aside>
      <section class="grow-1 p-4">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<style scoped></style>
