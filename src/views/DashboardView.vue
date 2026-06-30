<template>
  <div>
    <h2>DashBoard</h2>
    <p v-if="isLoading">로딩중</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <div v-else-if="summary" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4 w-full">
      <SummaryCard
        v-for="item in summaryCardData"
        :title="item.title"
        :value="item.value"
        :description="item.description"
        :key="item.title"
      />
    </div>
    <p v-else>표시할 데이터가 없습니다.</p>
  </div>
</template>

<script setup lang="ts">
import SummaryCard from '@/components/dashboard/SummaryCard.vue'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref } from 'vue'
import { fetchDashboardSummaryApi } from '@/components/dashboard/api'
import type {
  ApiErrorResponse,
  DashboardSummary,
  DashboardSummaryResponse,
  SummaryCardItem,
} from '@/components/dashboard/types'
const authStore = useAuthStore()

const summary = ref<DashboardSummary | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const summaryCardData = computed<SummaryCardItem[]>(() => {
  if (!summary.value) return []
  return [
    {
      title: '일간주문',
      value: summary.value.orders.today,
      description: '일간 주문수',
    },
    {
      title: '주간주문',
      value: summary.value.orders.weekly,
      description: '주간 주문수',
    },
    {
      title: '판매 중 상품',
      value: summary.value.products.selling,
      description: '판매 중인 상품 수',
    },
    {
      title: '월간 매출',
      value: `${summary.value.revenue.monthly.toLocaleString()}원`,
      description: '월간 누적 매출',
    },
  ]
})

const loadDashboardSummary = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await fetchDashboardSummaryApi(authStore.accessToken)
    const responseData = await response.json()
    if (!response.ok) {
      const errorData = responseData as ApiErrorResponse
      errorMessage.value = errorData.message || '대시보드 정보를 불러오는데 실패했습니다.'
      return
    }
    const successData = responseData as DashboardSummaryResponse
    summary.value = successData.data
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : '대시보드 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardSummary()
})
</script>
