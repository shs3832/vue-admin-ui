<template>
  <section>
    <form class="mb-4 flex flex-wrap items-end gap-3" @submit.prevent="emit('search')">
      <div class="flex flex-col gap-1">
        <label for="user-search-keyword" :class="labelStyle">검색어</label>
        <input
          id="user-search-keyword"
          type="text"
          :class="inputStyle"
          placeholder="이름 이메일 부서 검색"
          :value="searchKeyword"
          @input="emit('update:searchKeyword', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="user-search-role" :class="labelStyle">역할</label>
        <select
          id="user-search-role"
          :class="selectStyle"
          @change="
            emit(
              'update:searchRole',
              ($event.target as HTMLSelectElement).value as IUser['role'] | '',
            )
          "
          :value="searchRole"
        >
          <option value="">전체</option>
          <option v-for="role in roles" :key="role.value" :value="role.value">
            {{ userRoleLabels[role.value] }} ({{ role.count }})
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label for="user-search-status" :class="labelStyle">상태</label>
        <select
          id="user-search-status"
          :class="selectStyle"
          @change="
            emit(
              'update:searchStatus',
              ($event.target as HTMLSelectElement).value as IUser['status'] | '',
            )
          "
          :value="searchStatus"
        >
          <option value="">전체</option>
          <option v-for="status in statuses" :key="status.value" :value="status.value">
            {{ userStatusLabels[status.value] }} ({{ status.count }})
          </option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label for="user-search-sort" :class="labelStyle">정렬</label>
        <select
          id="user-search-sort"
          :class="selectStyle"
          @change="
            emit('update:selectedSort', ($event.target as HTMLSelectElement).value as UserSort | '')
          "
          :value="selectedSort"
        >
          <option value="">기본</option>
          <option value="name:asc">이름 오름차순</option>
          <option value="name:desc">이름 내림차순</option>
          <option value="createdAt:desc">생성일 최신순</option>
          <option value="createdAt:asc">생성일 오래된순</option>
        </select>
      </div>
      <div class="flex flex-wrap gap-3">
        <button
          type="submit"
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer"
        >
          검색
        </button>
        <button
          type="button"
          class="rounded-md border border-border-strong px-4 py-2 text-sm cursor-pointer"
          @click="emit('reset')"
        >
          초기화
        </button>
      </div>
      <div class="flex ml-auto">
        <button
          type="button"
          class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer"
          @click="emit('createUser')"
          v-if="canCreateUser"
        >
          사용자 생성
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import type { IUser, UsersMeta, UserSort } from '@/types/users'

const labelStyle = `text-sm font-medium text-text-secondary`
const inputStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const selectStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
defineProps<{
  searchKeyword: string
  searchRole: IUser['role'] | ''
  searchStatus: IUser['status'] | ''
  canCreateUser: boolean
  selectedSort: UserSort | ''
  roles: UsersMeta['roles']
  statuses: UsersMeta['statuses']
}>()
const emit = defineEmits<{
  'update:searchKeyword': [value: string]
  'update:searchRole': [value: IUser['role'] | '']
  'update:searchStatus': [value: IUser['status'] | '']
  'update:selectedSort': [value: UserSort | '']
  search: []
  reset: []
  createUser: []
}>()

const userRoleLabels: Record<IUser['role'], string> = {
  admin: '관리자',
  manager: '매니저',
  editor: '에디터',
}

const userStatusLabels: Record<IUser['status'], string> = {
  active: '활성',
  inactive: '비활성',
  pending: '대기',
}
</script>

<style scoped></style>
