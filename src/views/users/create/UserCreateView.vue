<template>
  <div>
    <h2>사용자 생성</h2>
    <p>신규 관리자 계정을 생성합니다.</p>
    <form class="space-y-4 py-4" @submit.prevent="handleSubmit">
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
        <label for="" :class="labelStyle">비밀번호 <small class="text-red-500">*</small></label>
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
          {{ isSubmitting ? '생성 중' : '생성' }}
        </button>
        <button
          type="button"
          :class="buttonDefaultStyle"
          :disabled="isSubmitting"
          @click="handleCancel"
        >
          취소
        </button>
      </div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { createUserApi } from '@/components/users/api'
import type {
  ApiErrorResponse,
  CreateUserForm,
  CreateUserFormErrors,
} from '@/components/users/types'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const boxStyle = `flex flex-col gap-1`
const labelStyle = `text-sm font-medium text-text-secondary`
const inputStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const selectStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const errorStyle = `text-sm text-red-600`
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const buttonDefaultStyle = `rounded-md border border-border-strong px-4 py-2 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`

const isSubmitting = ref(false)
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const form = ref<CreateUserForm>({
  name: '',
  email: '',
  password: '',
  role: '',
  status: 'active',
  department: '운영',
})

const fieldErrors = ref<CreateUserFormErrors>({})

const formValidate = () => {
  const nextErrors: CreateUserFormErrors = {}
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
  if (!password) {
    nextErrors.password = '비밀번호는 필수입니다'
  } else if (password.length < 8) {
    nextErrors.password = '비밀번호는 8자리 이상 입력해주세요'
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
const handleSubmit = async () => {
  isSubmitting.value = true
  errorMessage.value = ''
  fieldErrors.value = {}
  const isValidate = formValidate()

  if (!isValidate) {
    isSubmitting.value = false
    return
  }
  try {
    const response = await createUserApi(authStore.accessToken, form.value)
    const responseData = await response.json()
    if (!response.ok) {
      const errorData = responseData as ApiErrorResponse
      errorMessage.value = errorData.message || '사용자 생성에 실패했습니다.'

      if (errorData.errors) {
        const nextErrors: CreateUserFormErrors = {}

        if (errorData.errors.name) {
          nextErrors.name = errorData.errors.name
        }

        if (errorData.errors.email) {
          nextErrors.email = errorData.errors.email
        }

        if (errorData.errors.password) {
          nextErrors.password = errorData.errors.password
        }

        if (errorData.errors.role) {
          nextErrors.role = errorData.errors.role
        }

        if (errorData.errors.status) {
          nextErrors.status = errorData.errors.status
        }

        if (errorData.errors.department) {
          nextErrors.department = errorData.errors.department
        }

        fieldErrors.value = nextErrors
      }
      return
    }

    router.push({ name: 'users' })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '유저 정보를 불러오지 못했습니다.'
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'users' })
}
</script>
