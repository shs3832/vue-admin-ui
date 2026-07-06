<template>
  <span
    :class="['inline-flex px-2 py-1 text-xs font-medium rounded-full', statusClassMap[status]]"
    >{{ statusMap[status] }}</span
  >
</template>

<script setup lang="ts">
import type { IProduct } from '@/types/products'

const statusMap = {
  soldout: '품절',
  selling: '판매중',
  hidden: '숨김',
}

const statusClassMap = {
  selling: 'bg-green-100 text-green-700',
  hidden: 'bg-gray-100 text-gray-600',
  soldout: 'bg-red-100 text-red-700',
}

defineProps<{
  status: IProduct['status']
}>()
</script>
