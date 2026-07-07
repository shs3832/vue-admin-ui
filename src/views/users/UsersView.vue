<template>
  <div>
    <SearchFilterBar
      v-model:searchKeyword="searchKeyword"
      v-model:searchRole="searchRole"
      v-model:searchStatus="searchStatus"
      @search="handleSearch"
      @reset="handleResetSearch"
      @createUser="handleCreateUser"
      :canManageUsers="canManageUsers"
    />

    <LoadingState v-if="isInitialLoading" message="목록을 불러오는 중입니다." />
    <ErrorState v-else-if="errorMessage" :message="errorMessage" @retry="loadUsersList" />
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
            <th :class="thStyle">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isTableLoading">
            <td :class="[tdStyle, 'text-center']" colspan="7">목록을 불러오는 중입니다.</td>
          </tr>
          <tr v-for="item in users" :key="item.id">
            <td :class="tdStyle">{{ item.name }}</td>
            <td :class="tdStyle">{{ item.email }}</td>
            <td :class="tdStyle"><UserRoleBadge :role="item.role" /></td>
            <td :class="tdStyle"><UserStatusBadge :status="item.status" /></td>
            <td :class="tdStyle">{{ item.department ?? '-' }}</td>
            <td :class="tdStyle">
              {{ item.lastLoginAt ? formatDateTime(item.lastLoginAt) : '-' }}
            </td>
            <td :class="tdStyle">
              <button
                v-if="canManageUsers"
                :class="buttonDefaultStyle"
                @click="handleEdit(item.id)"
              >
                수정
              </button>
              <button
                v-if="canManageUsers"
                type="button"
                :class="[buttonDangerStyle, 'ml-2']"
                @click="handleOpenDeleteDialog(item)"
              >
                삭제
              </button>
              <span class="text-sm text-text-secondary" v-else>권한없음</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <EmptyState v-else title="표시할 유저가 없습니다." description="사용자를 등록해보세요">
      <button type="button" :class="buttonPrimaryStyle" @click="handleCreateUser">유저 생성</button>
    </EmptyState>

    <PaginationBar v-if="pagination" :pagination="pagination" @changePage="handleChangePage" />
    <ConfirmDialog
      :open="isDeleteDialogOpen"
      :title="`삭제 확인`"
      :description="`${selectUserForDelete?.name ?? '해당'} 사용자를 삭제하시겠습니까?`"
      @confirm="handleConfirmDelete"
      @cancel="handleCloseModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref } from 'vue'
import { type PaginationMeta, isApiError } from '@/types/api'
import type { IUser, UsersQuery } from '@/types/users'

import UserRoleBadge from '@/components/users/UserRoleBadge.vue'
import UserStatusBadge from '@/components/users/UserStatusBadge.vue'
import { deleteUserApi, fetchUsersApi } from '@/api/users'
import SearchFilterBar from '@/components/users/SearchFilterBar.vue'
import PaginationBar from '@/components/users/PaginationBar.vue'
import { useRouter } from 'vue-router'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { formatDateTime } from '@/utils/date'
import { useListStatus } from '@/composables/useListStatus'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import { useAuthErrorHandler } from '@/composables/useAuthErrorHandler'

const thStyle = `border-b border-border px-4 py-3 text-left font-medium text-text-secondary`
const tdStyle = `border-b border-border px-4 py-3`
const buttonDefaultStyle = `rounded-md border border-border-strong px-2 py-1 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const buttonDangerStyle = `${buttonDefaultStyle} bg-red-500 text-white border-red-500`
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50`

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)
const errorMessage = ref('')
const users = ref<IUser[]>([])
const selectUserForDelete = ref<IUser | null>(null)
const searchKeyword = ref('')
const searchRole = ref<IUser['role'] | ''>('')
const searchStatus = ref<IUser['status'] | ''>('')
const currentPage = ref(1)
const limit = ref(10)
const pagination = ref<PaginationMeta | null>(null)
const { handleAuthError } = useAuthErrorHandler()

const { hasItems: hasUsers, isInitialLoading, isTableLoading } = useListStatus(users, isLoading)
const isDeleteDialogOpen = computed(() => {
  return selectUserForDelete.value !== null
})
const canManageUsers = computed(() => authStore.user?.role === 'admin')

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
    users.value = response.items
    pagination.value = response.pagination
  } catch (error) {
    if (handleAuthError(error)) return
    if (isApiError(error)) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '유저 정보를 불러오지 못했습니다.'
    }
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

const handleCreateUser = () => {
  router.push({ name: 'userCreate' })
}

const handleEdit = (id: number) => {
  router.push({ name: 'userEdit', params: { id: id } })
}

const handleConfirmDelete = async () => {
  if (!selectUserForDelete.value) return
  const user = selectUserForDelete.value
  try {
    await deleteUserApi(authStore.accessToken, user.id)
    selectUserForDelete.value = null
    loadUsersList()
  } catch (error) {
    selectUserForDelete.value = null
    if (handleAuthError(error)) return
    if (isApiError(error)) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '유저 정보를 삭제하지 못했습니다.'
    }
  }
}

const handleOpenDeleteDialog = (user: IUser) => {
  selectUserForDelete.value = user
}

const handleCloseModal = () => {
  selectUserForDelete.value = null
}

onMounted(() => {
  loadUsersList()
})
</script>
