<template>
  <div>
    <LoadingState v-if="isLoading" message="활동 로그를 불러오는 중입니다." />
    <ErrorState v-else-if="errorMessage" :message="errorMessage" @retry="getActivityLogs" />
    <EmptyState v-else-if="isEmpty" title="표시할 활동 로그가 없습니다.">
      <button type="button" :class="buttonPrimaryStyle" @click="getActivityLogs">
        다시 불러오기
      </button>
    </EmptyState>
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
import { fetchActivityLogsApi } from '@/api/activityLogs'
import type { ApiErrorResponse, PaginationMeta } from '@/types/api'
import type { ActivityLogItem, ActivityLogsResponse } from '@/types/activityLogs'

import { useAuthStore } from '@/stores/auth'
import { formatDateTime } from '@/utils/date'

import { onMounted, ref } from 'vue'
import { useListStatus } from '@/composables/useListStatus'

const authStore = useAuthStore()
const activityLogs = ref<ActivityLogItem[]>([])
const pagination = ref<PaginationMeta | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`

const { isEmpty } = useListStatus(activityLogs, isLoading)
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
