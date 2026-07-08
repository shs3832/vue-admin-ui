<template>
  <div>
    <form class="space-y-4 py-4" @submit.prevent="handleSubmit">
      <div :class="boxStyle">
        <label for="name" :class="labelStyle">이름 <small class="text-red-500">*</small></label>
        <input
          id="name"
          name="name"
          type="text"
          :class="inputStyle"
          v-model="form.name"
          :aria-invalid="Boolean(fieldErrors.name)"
          :aria-describedby="fieldErrors.name ? 'name-error' : undefined"
          ref="nameInputRef"
        />
        <p v-if="fieldErrors.name" :class="errorStyle" id="name-error">
          {{ fieldErrors.name }}
        </p>
      </div>

      <div :class="boxStyle">
        <label for="email" :class="labelStyle">이메일 <small class="text-red-500">*</small></label>
        <input
          id="email"
          name="email"
          type="email"
          :class="inputStyle"
          v-model="form.email"
          :aria-invalid="Boolean(fieldErrors.email)"
          :aria-describedby="fieldErrors.email ? 'email-error' : undefined"
          ref="emailInputRef"
        />
        <p v-if="fieldErrors.email" :class="errorStyle" id="email-error">
          {{ fieldErrors.email }}
        </p>
      </div>

      <div :class="boxStyle">
        <label for="password" :class="labelStyle"
          >비밀번호 <small class="text-red-500">*</small></label
        >
        <input
          id="password"
          name="password"
          type="password"
          :class="inputStyle"
          v-model="form.password"
          :aria-invalid="Boolean(fieldErrors.password)"
          :aria-describedby="fieldErrors.password ? 'password-error' : undefined"
          ref="passwordInputRef"
        />
        <p v-if="fieldErrors.password" :class="errorStyle" id="password-error">
          {{ fieldErrors.password }}
        </p>
      </div>

      <div :class="boxStyle">
        <label for="role" :class="labelStyle">역할 <small class="text-red-500">*</small></label>
        <select
          id="role"
          name="role"
          :class="selectStyle"
          v-model="form.role"
          :aria-invalid="Boolean(fieldErrors.role)"
          :aria-describedby="fieldErrors.role ? 'role-error' : undefined"
          ref="roleSelectRef"
        >
          <option value="">역할 선택</option>
          <option value="admin">관리자</option>
          <option value="manager">매니저</option>
          <option value="editor">에디터</option>
        </select>
        <p v-if="fieldErrors.role" :class="errorStyle" id="role-error">
          {{ fieldErrors.role }}
        </p>
      </div>

      <div :class="boxStyle">
        <label for="status" :class="labelStyle">상태 <small class="text-red-500">*</small></label>
        <select
          id="status"
          name="status"
          :class="selectStyle"
          v-model="form.status"
          :aria-invalid="Boolean(fieldErrors.status)"
          :aria-describedby="fieldErrors.status ? 'status-error' : undefined"
          ref="statusSelectRef"
        >
          <option value="">상태 선택</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="pending">대기</option>
        </select>
        <p v-if="fieldErrors.status" :class="errorStyle" id="status-error">
          {{ fieldErrors.status }}
        </p>
      </div>

      <div :class="boxStyle">
        <label for="department" :class="labelStyle">부서</label>
        <input
          id="department"
          name="department"
          type="text"
          :class="inputStyle"
          v-model="form.department"
        />
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
import { createUserApi } from '@/api/users'
import { isApiError } from '@/types/api'
import type { CreateUserForm, CreateUserFormErrors } from '@/types/users'
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthErrorHandler } from '@/composables/useAuthErrorHandler'

const boxStyle = `flex flex-col gap-1`
const labelStyle = `text-sm font-medium text-text-secondary`
const inputStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const selectStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const errorStyle = `text-sm text-red-600`
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const buttonDefaultStyle = `rounded-md border border-border-strong px-4 py-2 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`

const nameInputRef = ref<HTMLInputElement | null>(null)
const emailInputRef = ref<HTMLInputElement | null>(null)
const passwordInputRef = ref<HTMLInputElement | null>(null)
const roleSelectRef = ref<HTMLSelectElement | null>(null)
const statusSelectRef = ref<HTMLSelectElement | null>(null)

const isSubmitting = ref(false)
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()
const { handleAuthError } = useAuthErrorHandler()

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
  if (Object.keys(nextErrors).length > 0) {
    focusFirstErrorField(nextErrors)
  }

  return Object.keys(nextErrors).length === 0
}

const focusFirstErrorField = (errors: CreateUserFormErrors) => {
  if (errors.name) {
    nameInputRef.value?.focus()
    return
  }
  if (errors.email) {
    emailInputRef.value?.focus()
    return
  }
  if (errors.password) {
    passwordInputRef.value?.focus()
    return
  }
  if (errors.role) {
    roleSelectRef.value?.focus()
    return
  }
  if (errors.status) {
    statusSelectRef.value?.focus()
  }
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
    await createUserApi(authStore.accessToken, form.value)
    router.push({ name: 'users' })
  } catch (error) {
    if (handleAuthError(error)) return
    if (isApiError(error)) {
      errorMessage.value = error.message
      fieldErrors.value = error.fieldErrors ?? {}
    } else {
      errorMessage.value = '사용자 생성에 실패했습니다.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'users' })
}

onMounted(() => {
  nameInputRef.value?.focus()
})
</script>
