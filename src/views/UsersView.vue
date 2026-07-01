<template>
  <div>
    <SearchFilterBar
      v-model:searchKeyword="searchKeyword"
      v-model:searchRole="searchRole"
      v-model:searchStatus="searchStatus"
      @search="handleSearch"
      @reset="handleResetSearch"
    />

    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-else-if="isInitialLoading">목록을 불러오는 중입니다.</p>
    <div v-else-if="hasUsers">
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
          <tr v-if="isTableLoading">
            <td :class="[tdStyle, 'text-center']" colspan="6">목록을 불러오는 중입니다.</td>
          </tr>
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

    <PaginationBar v-if="pagination" :pagination="pagination" @changePage="handleChangePage" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref } from 'vue'
import type {
  PaginationMeta,
  ApiErrorResponse,
  IUser,
  IUsersResponse,
  UsersQuery,
} from '@/components/users/types'
import UserRoleBadge from '@/components/users/UserRoleBadge.vue'
import UserStatusBadge from '@/components/users/UserStatusBadge.vue'
import { fetchUsersApi } from '@/components/users/api'
import SearchFilterBar from '@/components/users/SearchFilterBar.vue'
import PaginationBar from '@/components/users/PaginationBar.vue'
const thStyle = `border-b border-border px-4 py-3 text-left font-medium text-text-secondary`
const tdStyle = `border-b border-border px-4 py-3`

const authStore = useAuthStore()
const isLoading = ref(false)
const errorMessage = ref('')
const users = ref<IUser[]>([])
const searchKeyword = ref('')
const searchRole = ref<IUser['role'] | ''>('')
const searchStatus = ref<IUser['status'] | ''>('')
const currentPage = ref(1)
const limit = ref(10)
const pagination = ref<PaginationMeta | null>(null)

// hasUsers: 보여줄 기존 목록이 있는가
// isInitialLoading: 아직 목록이 없는데 로딩 중인가 (최초 로딩시 사용)
// isTableLoading: 기존 목록이 있는데 새 요청 중인가 (로딩 후 목록이 있으면서 페이지네이션으로 넘어갈 시 활용)
const hasUsers = computed(() => users.value.length > 0)
const isInitialLoading = computed(() => isLoading.value && !hasUsers.value)
const isTableLoading = computed(() => isLoading.value && hasUsers.value)
const loadUsersList = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const searchQuery: UsersQuery = {
    keyword: searchKeyword.value,
    role: searchRole.value,
    status: searchStatus.value,
    page: currentPage.value,
    limit: limit.value,
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
    pagination.value = successData.pagination
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '유저 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadUsersList()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  loadUsersList()
}

const handleResetSearch = () => {
  searchKeyword.value = ''
  searchRole.value = ''
  searchStatus.value = ''
  currentPage.value = 1
  loadUsersList()
}

onMounted(() => {
  loadUsersList()
})
</script>

<style scoped></style>
