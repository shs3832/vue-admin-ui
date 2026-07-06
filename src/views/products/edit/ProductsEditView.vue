<template>
  <div>
    <LoadingState v-if="initLoading" message="상품 정보를 불러오는 중입니다." />
    <ErrorState
      v-else-if="loadErrorMessage"
      :message="loadErrorMessage"
      @retry="getProductDetail"
    />
    <div v-else class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold text-text-primary">상품 수정</h2>
        <p class="mt-1 text-sm text-text-secondary">운영 상품 정보를 수정합니다.</p>
      </div>
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div :class="boxStyle">
          <label for="name" :class="labelStyle"
            >상품명 <span class="text-red-600" aria-hidden="true">*</span></label
          >
          <input
            :class="inputStyle"
            id="name"
            name="name"
            type="text"
            placeholder="상품명 입력"
            v-model="form.name"
          />
          <p :class="errorStyle" v-if="fieldErrors.name">
            {{ fieldErrors.name }}
          </p>
        </div>
        <div :class="boxStyle">
          <label for="category" :class="labelStyle"
            >카테고리 <span class="text-red-600" aria-hidden="true">*</span></label
          >
          <input
            :class="inputStyle"
            type="text"
            placeholder="카테고리 입력"
            id="category"
            name="category"
            v-model="form.category"
          />
          <p :class="errorStyle" v-if="fieldErrors.category">
            {{ fieldErrors.category }}
          </p>
        </div>
        <div :class="boxStyle">
          <label for="price" :class="labelStyle"
            >가격 <span class="text-red-600" aria-hidden="true">*</span></label
          >
          <input
            :class="inputStyle"
            type="number"
            id="price"
            name="price"
            placeholder="가격 입력"
            v-model.number="form.price"
          />
          <p :class="errorStyle" v-if="fieldErrors.price">
            {{ fieldErrors.price }}
          </p>
        </div>
        <div :class="boxStyle">
          <label for="stock" :class="labelStyle"
            >재고 <span class="text-red-600" aria-hidden="true">*</span></label
          >
          <input
            :class="inputStyle"
            type="number"
            id="stock"
            name="stock"
            placeholder="재고 입력"
            v-model.number="form.stock"
          />
          <p :class="errorStyle" v-if="fieldErrors.stock">
            {{ fieldErrors.stock }}
          </p>
        </div>
        <div :class="boxStyle">
          <label for="status" :class="labelStyle"
            >상태 <span class="text-red-600" aria-hidden="true">*</span></label
          >
          <select id="status" name="status" :class="selectStyle" v-model="form.status">
            <option value="selling">판매중</option>
            <option value="hidden">숨김</option>
            <option value="soldout">품절</option>
          </select>
          <p :class="errorStyle"></p>
        </div>
        <div :class="boxStyle">
          <label :class="labelStyle">상품 이미지</label>
          <div class="flex items-center gap-4">
            <div
              class="flex h-24 w-24 items-center justify-center rounded-md bg-bg-muted text-sm text-text-muted"
            >
              <img
                v-if="previewImage"
                :src="previewImage"
                alt="미리보기"
                class="h-24 w-24 rounded-md object-cover"
              />

              <div v-else>No image</div>
            </div>

            <div class="flex flex-col gap-2">
              <input
                id="product-image"
                name="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                @change="handleGetFile"
                class="sr-only"
              />
              <label for="product-image" :class="uploadButtonStyle"> 이미지 선택 </label>
              <p v-if="selectedFileName" class="text-sm text-text-muted">
                파일명 : {{ selectedFileName }}
              </p>
            </div>
          </div>

          <p class="text-sm text-text-muted">JPG, PNG, WEBP / 최대 5MB</p>
          <p :class="errorStyle" v-if="uploadErrorMessage">{{ uploadErrorMessage }}</p>
        </div>
        <div :class="boxStyle">
          <label for="description" :class="labelStyle">설명</label>
          <textarea
            :class="textareaStyle"
            id="description"
            name="description"
            placeholder="설명 입력"
            v-model="form.description"
          ></textarea>
          <p :class="errorStyle"></p>
        </div>

        <div>
          <div class="flex flex-wrap gap-3 pt-2">
            <button type="submit" :class="buttonPrimaryStyle" :disabled="isLoading">수정</button>
            <button type="button" :class="buttonDefaultStyle" :disabled="isLoading">취소</button>
          </div>
          <p v-if="createErrorMessage">{{ createErrorMessage }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getProductsDetailApi, updateProductApi, uploadProductImageApi } from '@/api/products'

import type { ApiErrorResponse } from '@/types/api'
import type {
  ProductDetailResponse,
  ProductForm,
  ProductsFormErrors,
  UpdateProductPayload,
  UploadImageResponse,
} from '@/types/products'
import { useAuthStore } from '@/stores/auth'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const boxStyle = `flex flex-col gap-1`
const labelStyle = `text-sm font-medium text-text-secondary`
const inputStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const selectStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const textareaStyle = `min-h-24 rounded-md border border-border-strong px-3 py-2 text-sm`
const errorStyle = `text-sm text-red-600`
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const buttonDefaultStyle = `rounded-md border border-border-strong px-4 py-2 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const uploadButtonStyle = `inline-flex w-fit cursor-pointer items-center justify-center rounded-md border border-border-strong bg-bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-muted`

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const productId = Number(route.params.id)
const loadErrorMessage = ref('')
const selectedFileName = ref('')
const previewImage = ref('')
const isLoading = ref(false)
const uploadErrorMessage = ref('')
const createErrorMessage = ref('')
const initLoading = ref(false)
const selectedFile = ref<File | null>(null)
const form = ref<ProductForm>({
  name: '',
  category: '',
  price: 0,
  status: 'selling',
  stock: 0,
  thumbnailUrl: '',
  description: '',
})

const fieldErrors = ref<ProductsFormErrors>({})

const handleGetFile = async (event: Event) => {
  uploadErrorMessage.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return
  selectedFileName.value = file.name

  if (previewImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.value)
  }
  selectedFile.value = file
  previewImage.value = URL.createObjectURL(file)
}

const formValidation = () => {
  const nextErrors: ProductsFormErrors = {}
  if (!form.value.name.trim()) {
    nextErrors.name = '상품명은 필수입니다'
  }

  if (!form.value.category.trim()) {
    nextErrors.category = '카테고리명은 필수입니다'
  }

  if (form.value.price <= 0) {
    nextErrors.price = '가격은 0보다 큰 값을 입력해주세요'
  }

  if (form.value.stock <= 0) {
    nextErrors.stock = '재고는 0보다 큰 값을 입력해주세요'
  }

  fieldErrors.value = nextErrors

  return Object.keys(nextErrors).length === 0
}

const getProductDetail = async () => {
  initLoading.value = true
  try {
    const response = await getProductsDetailApi(authStore.accessToken, productId)
    const responseData = await response.json()

    if (!response.ok) {
      const errorData = responseData as ApiErrorResponse
      loadErrorMessage.value = errorData.message || '제품 정보를 불러오지 못했습니다.'
      return
    }
    const successData = responseData as ProductDetailResponse
    form.value.name = successData.data.name
    form.value.category = successData.data.category
    form.value.price = successData.data.price
    form.value.status = successData.data.status
    form.value.stock = successData.data.stock
    form.value.thumbnailUrl = successData.data.thumbnailUrl
    form.value.description = successData.data.description

    previewImage.value = form.value?.thumbnailUrl || ''
  } catch (error) {
    loadErrorMessage.value =
      error instanceof Error ? error.message : '제품 정보를 불러오지 못했습니다.'
  } finally {
    initLoading.value = false
  }
}

const handleSubmit = async () => {
  fieldErrors.value = {}
  const isValid = formValidation()
  if (!isValid) return

  try {
    isLoading.value = true
    const payload: UpdateProductPayload = { ...form.value }
    if (selectedFile.value) {
      const uploadResponse = await uploadProductImageApi(authStore.accessToken, selectedFile.value)
      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        const errorData = uploadData as ApiErrorResponse
        uploadErrorMessage.value = errorData.message || '파일 업로드에 실패했습니다.'
        return
      }
      const successData = uploadData as UploadImageResponse
      payload.thumbnailUrl = successData.data.url
    }
    if (!payload.description?.trim()) {
      delete payload.description
    }

    const response = await updateProductApi(authStore.accessToken, payload, productId)
    const responseData = await response.json()
    if (!response.ok) {
      const errorData = responseData as ApiErrorResponse
      createErrorMessage.value = errorData.message || '상품 수정에 실패했습니다.'
      if (errorData.errors) {
        const nextErrors: ProductsFormErrors = {}

        if (errorData.errors.name) {
          nextErrors.name = errorData.errors.name
        }

        if (errorData.errors.category) {
          nextErrors.category = errorData.errors.category
        }

        if (errorData.errors.price) {
          nextErrors.price = errorData.errors.price
        }

        if (errorData.errors.stock) {
          nextErrors.stock = errorData.errors.stock
        }

        fieldErrors.value = nextErrors
      }
      return
    }
    router.push({ name: 'products' })
  } catch (error) {
    createErrorMessage.value = error instanceof Error ? error.message : '상품 수정에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getProductDetail()
})

onUnmounted(() => {
  if (previewImage.value.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.value)
  }
})
</script>

<style scoped></style>
