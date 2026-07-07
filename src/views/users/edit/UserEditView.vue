<template>
  <div>
    <h2>사용자 수정</h2>
    <p>관리자 계정을 수정합니다.</p>
    <LoadingState v-if="isLoading" message="사용자 정보를 불러오는 중입니다." />
    <ErrorState v-else-if="errorMessage" :message="errorMessage" @retry="getUserInfo" />
    <form v-else class="space-y-4 py-4" @submit.prevent="handleEditSubmit">
      <div :class="boxStyle">
        <label for="" :class="labelStyle">이름 <small class="text-red-500">*</small></label>
        <input type="text" :class="inputStyle" v-model="form.name" />
        <p v-if="fieldErrors.name" :class="errorStyle">
          {{ fieldErrors.name }}
        </p>
      </div>

      <div :class="boxStyle">
        <label for="" :class="labelStyle">이메일 <small class="text-red-500">*</small></label>
        <input type="email" :class="inputStyle" v-model="form.email" />
        <p v-if="fieldErrors.email" :class="errorStyle">
          {{ fieldErrors.email }}
        </p>
      </div>

      <div :class="boxStyle">
        <label for="" :class="labelStyle">비밀번호 </label>
        <input type="password" :class="inputStyle" v-model="form.password" />
        <p v-if="fieldErrors.password" :class="errorStyle">
          {{ fieldErrors.password }}
        </p>
      </div>

      <div :class="boxStyle">
        <label for="" :class="labelStyle">역할 <small class="text-red-500">*</small></label>
        <select :class="selectStyle" v-model="form.role">
          <option value="">역할 선택</option>
          <option value="admin">관리자</option>
          <option value="manager">매니저</option>
          <option value="editor">에디터</option>
        </select>
        <p v-if="fieldErrors.role" :class="errorStyle">
          {{ fieldErrors.role }}
        </p>
      </div>

      <div :class="boxStyle">
        <label for="" :class="labelStyle">상태 <small class="text-red-500">*</small></label>
        <select :class="selectStyle" v-model="form.status">
          <option value="">상태 선택</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="pending">대기</option>
        </select>
        <p v-if="fieldErrors.status" :class="errorStyle">
          {{ fieldErrors.status }}
        </p>
      </div>

      <div :class="boxStyle">
        <label for="" :class="labelStyle">부서</label>
        <input type="text" :class="inputStyle" v-model="form.department" />
      </div>

      <div class="flex flex-wrap gap-3">
        <button type="submit" :class="buttonPrimaryStyle" :disabled="isSubmitting">
          {{ isSubmitting ? '수정 중' : '수정' }}
        </button>
        <button
          type="button"
          :class="buttonDefaultStyle"
          @click="handleCancel"
          :disabled="isSubmitting"
        >
          취소
        </button>
      </div>
    </form>
    <p v-if="submitErrorMessage">{{ submitErrorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { getUserApi, updateUserApi } from '@/api/users'
import type { UpdateUserForm, UpdateUserFormErrors } from '@/types/users'
import { isApiError } from '@/types/api'
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const boxStyle = `flex flex-col gap-1`
const labelStyle = `text-sm font-medium text-text-secondary`
const inputStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const selectStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const errorStyle = `text-sm text-red-600`
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const buttonDefaultStyle = `rounded-md border border-border-strong px-4 py-2 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const getUserId = Number(route.params.id)

const isLoading = ref(false)
const submitErrorMessage = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const form = ref<UpdateUserForm>({
  name: '',
  email: '',
  role: '',
  status: 'active',
  department: '운영',
})

const fieldErrors = ref<UpdateUserFormErrors>({})
const formValidate = () => {
  const nextErrors: UpdateUserFormErrors = {}
  if (!form.value.name?.trim()) {
    nextErrors.name = '이름은 필수입니다'
  }
  const email = form.value.email?.trim()
  if (!email) {
    nextErrors.email = '이메일은 필수입니다'
  } else if (!email.includes('@')) {
    nextErrors.email = '이메일 형식에 맞춰 입력해주세요'
  }

  const password = form.value.password?.trim()
  if (password) {
    if (password.length < 8 && password.length !== 0) {
      nextErrors.password = '비밀번호는 8자리 이상 입력해주세요'
    }
  }

  if (!form.value.role) {
    nextErrors.role = '역할을 선택해주세요'
  }
  if (!form.value.status) {
    nextErrors.status = '상태를 선택해주세요'
  }

  fieldErrors.value = nextErrors

  return Object.keys(nextErrors).length === 0
}
const getUserInfo = async () => {
  if (Number.isNaN(getUserId)) {
    errorMessage.value = '잘못된 사용자 id 입니다.'
    return
  }
  isLoading.value = true
  try {
    const response = await getUserApi(authStore.accessToken, getUserId)

    const { data } = response
    form.value.name = data.name
    form.value.email = data.email
    form.value.role = data.role
    form.value.status = data.status
    form.value.department = data.department || ''
  } catch (error) {
    if (isApiError(error)) {
      errorMessage.value = error.message
      fieldErrors.value = error.fieldErrors ?? {}
    } else {
      errorMessage.value = '유저 정보를 불러오지 못했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

const handleEditSubmit = async () => {
  submitErrorMessage.value = ''
  fieldErrors.value = {}
  const isValid = formValidate()

  if (!isValid) {
    return
  }
  try {
    isSubmitting.value = true
    const payload = { ...form.value }
    if (!payload.password?.trim()) {
      delete payload.password
    }
    await updateUserApi(authStore.accessToken, payload, getUserId)
    router.push({ name: 'users' })
  } catch (error) {
    if (isApiError(error)) {
      submitErrorMessage.value = error.message
      fieldErrors.value = error.fieldErrors ?? {}
    } else {
      submitErrorMessage.value = '수정에 실패했습니다.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'users' })
}

onMounted(() => {
  getUserInfo()
})
</script>

<style scoped></style>
