<template>
  <div class="space-y-8">
    <header>
      <h2 class="text-2xl font-bold text-text-primary">Component Preview</h2>
      <p class="mt-1 text-sm text-text-secondary">
        공통 UI 컴포넌트의 상태와 사용 규칙을 확인합니다.
      </p>
    </header>

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
  </div>
</template>

<script setup lang="ts">
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'

import UserRoleBadge from '@/components/users/UserRoleBadge.vue'
import UserStatusBadge from '@/components/users/UserStatusBadge.vue'
import ProductStatusBadge from '@/components/products/ProductStatusBadge.vue'
import NotificationTypeBadge from '@/components/notifications/NotificationTypeBadge.vue'

const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`

const handleRetryPreview = () => {
  // console.log('retry preview')
}
</script>

<style scoped></style>
