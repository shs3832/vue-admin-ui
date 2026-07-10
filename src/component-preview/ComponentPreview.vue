<template>
  <div class="space-y-8">
    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold text-text-primary">Async States</h3>
        <p class="mt-1 text-sm text-text-secondary">
          loading, error, empty 상태를 화면별로 일관되게 표현합니다.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <article class="rounded-md border border-border bg-bg-surface p-4">
          <div class="mb-3">
            <strong class="block text-sm font-semibold text-text-primary">LoadingState</strong>
            <p class="mt-1 text-xs text-text-muted">데이터 요청이 진행 중인 상태</p>
          </div>
          <div class="rounded-md bg-bg-page p-3">
            <!-- preview component -->
            <LoadingState message="데이터를 불러오는 중입니다." />
          </div>
        </article>

        <article class="rounded-md border border-border bg-bg-surface p-4">
          <div class="mb-3">
            <strong class="block text-sm font-semibold text-text-primary">ErrorState</strong>
            <p class="mt-1 text-xs text-text-muted">요청 실패와 재시도 액션</p>
          </div>
          <div class="rounded-md bg-bg-page p-3">
            <!-- preview component -->
            <ErrorState message="상품 목록을 불러오지 못했습니다." @retry="handleRetryPreview" />
          </div>
        </article>

        <article class="rounded-md border border-border bg-bg-surface p-4">
          <div class="mb-3">
            <strong class="block text-sm font-semibold text-text-primary">EmptyState</strong>
            <p class="mt-1 text-xs text-text-muted">정상적인 빈 데이터 상태</p>
          </div>
          <div class="rounded-md bg-bg-page p-3">
            <!-- preview component -->
            <EmptyState
              title="표시할 데이터가 없습니다."
              description="데이터가 생성되면 이곳에 표시됩니다."
            >
              <button type="button" :class="buttonPrimaryStyle" @click="handleRetryPreview">
                다시 시도
              </button>
            </EmptyState>
          </div>
        </article>
      </div>
    </section>

    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold text-text-primary">Badges</h3>
        <p class="mt-1 text-sm text-text-secondary">
          도메인 상태값을 label과 tone으로 매핑해 한눈에 구분합니다.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <article class="rounded-md border border-border bg-bg-surface p-4">
          <strong class="block text-sm font-semibold text-text-primary">UserRoleBadge</strong>
          <div class="mt-3 flex flex-wrap gap-2">
            <UserRoleBadge role="admin" />
            <UserRoleBadge role="manager" />
            <UserRoleBadge role="editor" />
          </div>
        </article>

        <article class="rounded-md border border-border bg-bg-surface p-4">
          <strong class="block text-sm font-semibold text-text-primary">UserStatusBadge</strong>
          <div class="mt-3 flex flex-wrap gap-2">
            <UserStatusBadge status="active" />
            <UserStatusBadge status="inactive" />
            <UserStatusBadge status="pending" />
          </div>
        </article>

        <article class="rounded-md border border-border bg-bg-surface p-4">
          <strong class="block text-sm font-semibold text-text-primary">ProductStatusBadge</strong>
          <div class="mt-3 flex flex-wrap gap-2">
            <ProductStatusBadge status="selling" />
            <ProductStatusBadge status="hidden" />
            <ProductStatusBadge status="soldout" />
          </div>
        </article>

        <article class="rounded-md border border-border bg-bg-surface p-4">
          <strong class="block text-sm font-semibold text-text-primary">
            NotificationTypeBadge
          </strong>
          <div class="mt-3 flex flex-wrap gap-2">
            <NotificationTypeBadge type="info" />
            <NotificationTypeBadge type="success" />
            <NotificationTypeBadge type="warning" />
            <NotificationTypeBadge type="error" />
          </div>
        </article>
      </div>
    </section>

    <section class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold text-text-primary">Interactive Components</h3>
        <p class="mt-1 text-sm text-text-secondary">
          사용자 입력에 따라 상태가 바뀌고 이벤트를 전달하는 공통 UI입니다.
        </p>
      </div>

      <div class="grid gap-4">
        <article class="rounded-md border border-border bg-bg-surface p-4">
          <div class="mb-3">
            <strong class="block text-sm font-semibold text-text-primary">PaginationBar</strong>
            <p class="mt-1 text-xs text-text-muted">
              페이지 정보를 표시하고 changePage 이벤트로 현재 페이지를 변경합니다.
            </p>
          </div>
          <PaginationBar :pagination="previewPagination" @change-page="handlePreviewPageChange" />
        </article>

        <article class="rounded-md border border-border bg-bg-surface p-4">
          <div class="mb-3">
            <strong class="block text-sm font-semibold text-text-primary">ConfirmDialog</strong>
            <p class="mt-1 text-xs text-text-muted">
              중요한 변경 전에 내용을 다시 확인하고 확인·취소 이벤트를 전달합니다.
            </p>
          </div>
          <button type="button" :class="buttonPrimaryStyle" @click="isPreviewDialogOpen = true">
            상태 변경 다이얼로그 열기
          </button>

          <ConfirmDialog
            :open="isPreviewDialogOpen"
            title="상품 상태를 변경하시겠습니까?"
            description="선택한 상품의 상태가 판매중으로 변경됩니다."
            confirm-label="상태 변경"
            confirm-variant="primary"
            @confirm="handlePreviewDialogConfirm"
            @cancel="isPreviewDialogOpen = false"
          >
            <p class="text-sm text-text-secondary">선택 상품: 프리뷰 상품</p>
          </ConfirmDialog>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'

import UserRoleBadge from '@/components/users/UserRoleBadge.vue'
import UserStatusBadge from '@/components/users/UserStatusBadge.vue'
import ProductStatusBadge from '@/components/products/ProductStatusBadge.vue'
import NotificationTypeBadge from '@/components/notifications/NotificationTypeBadge.vue'
import type { PaginationMeta } from '@/types/api'

const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`

const handleRetryPreview = () => {
  // console.log('retry preview')
}

const previewPage = ref(6)
const previewPagination = computed<PaginationMeta>(() => ({
  page: previewPage.value,
  limit: 10,
  total: 120,
  totalPages: 12,
}))

const handlePreviewPageChange = (page: number) => {
  previewPage.value = page
}

const isPreviewDialogOpen = ref(false)
const handlePreviewDialogConfirm = () => {
  isPreviewDialogOpen.value = false
}
</script>

<style scoped></style>
