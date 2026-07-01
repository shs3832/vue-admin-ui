<template>
  <div>
    <SearchFilterBar
      v-model:searchKeyword="searchKeyword"
      v-model:searchRole="searchRole"
      v-model:searchStatus="searchStatus"
      @search="loadUsersList"
      @reset="handleResetSearch"
    />
    <p v-if="isLoading">로딩중</p>
    <p v-else-if="errorMessage">{{ errorMessage }}</p>
    <div v-else-if="users.length > 0">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th :class="thStyle">이름</th>
            <th :class="thStyle">이메일</th>
            <th :class="thStyle">역할</th>
            <th :class="thStyle">상태</th>
            <th :class="thStyle">부서</th>
            <th :class="thStyle">최근 로그인</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users" :key="item.id">
            <td :class="tdStyle">{{ item.name }}</td>
            <td :class="tdStyle">{{ item.email }}</td>
            <td :class="tdStyle"><UserRoleBadge :role="item.role" /></td>
            <td :class="tdStyle"><UserStatusBadge :status="item.status" /></td>
            <td :class="tdStyle">{{ item.department ?? '-' }}</td>
            <td :class="tdStyle">{{ item.lastLoginAt ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>표시할 사용자가 없습니다.</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import type { ApiErrorResponse, IUser, IUsersResponse, UsersQuery } from '@/components/users/types'
import UserRoleBadge from '@/components/users/UserRoleBadge.vue'
import UserStatusBadge from '@/components/users/UserStatusBadge.vue'
import { fetchUsersApi } from '@/components/users/api'
import SearchFilterBar from '@/components/users/SearchFilterBar.vue'
const thStyle = `border-b border-border px-4 py-3 text-left font-medium text-text-secondary`
const tdStyle = `border-b border-border px-4 py-3`

const authStore = useAuthStore()
const isLoading = ref(false)
const errorMessage = ref('')
const users = ref<IUser[]>([])
const searchKeyword = ref('')
const searchRole = ref<IUser['role'] | ''>('')
const searchStatus = ref<IUser['status'] | ''>('')

const loadUsersList = async () => {
  isLoading.value = true
  errorMessage.value = ''
  const searchQuery: UsersQuery = {
    keyword: searchKeyword.value,
    role: searchRole.value,
    status: searchStatus.value,
  }
  try {
    const response = await fetchUsersApi(authStore.accessToken, searchQuery)
    const responseData = await response.json()
    if (!response.ok) {
      const errorData = responseData as ApiErrorResponse
      errorMessage.value = errorData.message || '유저 정보가 없습니다.'
      return
    }
    const successData = responseData as IUsersResponse
    users.value = successData.items
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '유저 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

const handleResetSearch = () => {
  searchKeyword.value = ''
  searchRole.value = ''
  searchStatus.value = ''
  loadUsersList()
}

onMounted(() => {
  loadUsersList()
})
</script>

<style scoped></style>
