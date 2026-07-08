<template>
  <section>
    <form class="mb-4 flex flex-wrap items-end gap-3" @submit.prevent="emit('search')">
      <div class="flex flex-col gap-1">
        <label for="" :class="labelStyle">검색어</label>
        <input
          type="text"
          :class="inputStyle"
          placeholder="이름 이메일 부서 검색"
          :value="searchKeyword"
          @input="emit('update:searchKeyword', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="" :class="labelStyle">역할</label>
        <select
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
          <option value="admin">관리자</option>
          <option value="manager">매니저</option>
          <option value="editor">에디터</option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label for="" :class="labelStyle">상태</label>
        <select
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
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="pending">대기</option>
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
import type { IUser } from '@/types/users'

const labelStyle = `text-sm font-medium text-text-secondary`
const inputStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const selectStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
defineProps<{
  searchKeyword: string
  searchRole: IUser['role'] | ''
  searchStatus: IUser['status'] | ''
  canCreateUser: boolean
}>()
const emit = defineEmits<{
  'update:searchKeyword': [value: string]
  'update:searchRole': [value: IUser['role'] | '']
  'update:searchStatus': [value: IUser['status'] | '']
  search: []
  reset: []
  createUser: []
}>()
</script>

<style scoped></style>
