<template>
  <div>
    <LoadingState v-if="isLoading" message="대시보드 정보를 불러오는 중입니다." />
    <ErrorState v-else-if="errorMessage" :message="errorMessage" @retry="loadDashboardSummary" />
    <div v-else-if="summary" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4 w-full">
      <SummaryCard
        v-for="item in summaryCardData"
        :title="item.title"
        :value="item.value"
        :description="item.description"
        :key="item.title"
      />
    </div>
    <EmptyState
      v-else
      title="불러올 데이터가 없습니다."
      description="데이터가 준비되면 이곳에 표시됩니다."
    >
      <button type="button" :class="buttonPrimaryStyle" @click="loadDashboardSummary">
        데이터 가져오기
      </button>
    </EmptyState>
  </div>
</template>

<script setup lang="ts">
import SummaryCard from '@/components/dashboard/SummaryCard.vue'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref } from 'vue'
import { fetchDashboardSummaryApi } from '@/api/dashboard'
import { isApiError } from '@/types/api'
import type { DashboardSummary, SummaryCardItem } from '@/types/dashboard'
import { formatCurrency } from '@/utils/currency'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useAuthErrorHandler } from '@/composables/useAuthErrorHandler'
const authStore = useAuthStore()
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const summary = ref<DashboardSummary | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const { handleAuthError } = useAuthErrorHandler()
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
      value: formatCurrency(summary.value.revenue.monthly),
      description: '월간 누적 매출',
    },
  ]
})

const loadDashboardSummary = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await fetchDashboardSummaryApi(authStore.accessToken)
    summary.value = response.data
  } catch (error) {
    if (handleAuthError(error)) return
    if (isApiError(error)) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '대시보드 정보를 불러오지 못했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadDashboardSummary()
})
</script>
