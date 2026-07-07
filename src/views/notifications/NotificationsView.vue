<template>
  <div>
    <LoadingState v-if="isLoading" message="알림 목록을 불러오는 중입니다." />
    <ErrorState v-else-if="errorMessage" :message="errorMessage" @retry="getNotifications" />
    <EmptyState
      v-else-if="isEmpty"
      title="표시할 알림이 없습니다."
      description="알림이 있을경우 화면에 보여지게됩니다."
    >
      <button type="button" :class="buttonPrimaryStyle" @click="getNotifications">
        다시 불러오기
      </button>
    </EmptyState>
    <div v-else>
      <ul class="space-y-3">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="rounded-md border border-border bg-bg-surface p-4"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-text-primary">
                {{ notification.title }}
              </p>
              <p class="mt-1 text-sm text-text-secondary">
                {{ notification.message }}
              </p>
            </div>

            <p class="text-xs text-text-muted">
              {{ formatDateTime(notification.createdAt) }}
            </p>
          </div>

          <div class="mt-3 flex items-center gap-2">
            <NotificationTypeBadge :type="notification.type" />
            <span class="text-xs text-text-muted">
              {{ notification.isRead ? '읽음' : '안읽음' }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchNotificationsApi } from '@/api/notifications'
import NotificationTypeBadge from '@/components/notifications/NotificationTypeBadge.vue'
import { isApiError, type PaginationMeta } from '@/types/api'
import type { NotificationItem } from '@/types/notifications'
import { useAuthStore } from '@/stores/auth'
import { formatDateTime } from '@/utils/date'

import { onMounted, ref } from 'vue'
import { useListStatus } from '@/composables/useListStatus'
import { useAuthErrorHandler } from '@/composables/useAuthErrorHandler'
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`

const authStore = useAuthStore()
const notifications = ref<NotificationItem[]>([])
const pagination = ref<PaginationMeta | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const { handleAuthError } = useAuthErrorHandler()

const { isEmpty } = useListStatus(notifications, isLoading)
const getNotifications = async () => {
  isLoading.value = true
  try {
    const response = await fetchNotificationsApi(authStore.accessToken)
    notifications.value = response.items
    pagination.value = response.pagination
  } catch (error) {
    if (handleAuthError(error)) return
    if (isApiError(error)) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '알림 정보를 불러오지 못했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getNotifications()
})
</script>
