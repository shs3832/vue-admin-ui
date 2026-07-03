<template>
  <div>
    <p v-if="isLoading">활동 로그를 불러오는 중입니다.</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <p v-else-if="isEmpty">표시할 활동 로그가 없습니다.</p>
    <div v-else>
      <ul class="space-y-3">
        <li
          v-for="activityLog in activityLogs"
          :key="activityLog.id"
          class="rounded-md border border-border bg-bg-surface p-4"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-text-primary">
                {{ activityLog.actor }}
              </p>
              <p class="mt-1 text-sm text-text-secondary">
                {{ activityLog.action }}
              </p>
            </div>

            <p class="text-xs text-text-muted">
              {{ formatDateTime(activityLog.createdAt) }}
            </p>
          </div>

          <div class="mt-3 flex items-center gap-2">
            <span
              class="inline-flex rounded-full bg-bg-muted px-2.5 py-1 text-xs font-medium text-text-secondary"
            >
              {{ activityLog.target }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchActivityLogsApi } from '@/components/activity-logs/api'
import type {
  ActivityLogItem,
  ActivityLogsResponse,
  ApiErrorResponse,
  PaginationMeta,
} from '@/components/activity-logs/types'

import { useAuthStore } from '@/stores/auth'
import { formatDateTime } from '@/utils/date'

import { computed, onMounted, ref } from 'vue'

const authStore = useAuthStore()
const activityLogs = ref<ActivityLogItem[]>([])
const pagination = ref<PaginationMeta | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const isEmpty = computed(() => {
  return !isLoading.value && activityLogs.value.length === 0
})
const getActivityLogs = async () => {
  isLoading.value = true
  try {
    const response = await fetchActivityLogsApi(authStore.accessToken)
    const responseData = await response.json()

    if (!response.ok) {
      const errorData = responseData as ApiErrorResponse
      errorMessage.value = errorData.message || '활동 로그를 불러오지 못했습니다.'
      return
    }
    const successData = responseData as ActivityLogsResponse
    activityLogs.value = successData.items
    pagination.value = successData.pagination
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : '활동 로그 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getActivityLogs()
})
</script>
