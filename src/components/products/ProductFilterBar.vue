<template>
  <form class="mb-4 flex flex-wrap items-end gap-3" @submit.prevent="emit('filter')">
    <div class="flex flex-col gap-1">
      <label for="product-category-filter" :class="labelStyle"> 카테고리 </label>
      <select
        id="product-category-filter"
        :value="selectedCategory"
        @change="emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)"
        :class="selectStyle"
      >
        <option value="">전체</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>
    <div class="flex flex-col gap-1">
      <label for="product-status-filter" :class="labelStyle"> 상태 </label>
      <select
        id="product-status-filter"
        :value="selectedStatus"
        @change="
          emit(
            'update:selectedStatus',
            ($event.target as HTMLSelectElement).value as IProduct['status'] | '',
          )
        "
        :class="selectStyle"
      >
        <option value="">전체</option>
        <option v-for="status in statuses" :key="status.value" :value="status.value">
          {{ productStatusLabels[status.value] }} ({{ status.count }})
        </option>
      </select>
    </div>
    <button type="submit" :class="buttonPrimaryStyle">필터 적용</button>

    <div v-if="canCreateProduct" class="ml-auto flex items-center justify-end gap-4">
      <button type="button" :class="buttonPrimaryStyle" @click="emit('create')">상품 생성</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { IProduct, ProductsMeta } from '@/types/products'

const labelStyle = `text-sm font-medium text-text-secondary`
const selectStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white`

defineProps<{
  selectedCategory: string
  selectedStatus: IProduct['status'] | ''
  categories: string[]
  statuses: ProductsMeta['statuses']
  canCreateProduct: boolean
}>()

const emit = defineEmits<{
  'update:selectedCategory': [value: string]
  'update:selectedStatus': [value: IProduct['status'] | '']
  filter: []
  create: []
}>()

const productStatusLabels: Record<IProduct['status'], string> = {
  selling: '판매중',
  hidden: '숨김',
  soldout: '품절',
}
</script>

<style scoped></style>
