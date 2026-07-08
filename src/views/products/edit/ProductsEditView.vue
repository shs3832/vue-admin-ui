<template>
  <div>
    <LoadingState v-if="initLoading" message="상품 정보를 불러오는 중입니다." />
    <ErrorState
      v-else-if="loadErrorMessage"
      :message="loadErrorMessage"
      @retry="getProductDetail"
    />
    <div v-else class="space-y-6">
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
            :aria-invalid="Boolean(fieldErrors.name)"
            :aria-describedby="fieldErrors.name ? 'name-error' : undefined"
            ref="nameInputRef"
          />
          <p :class="errorStyle" v-if="fieldErrors.name" id="name-error">
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
            :aria-invalid="Boolean(fieldErrors.category)"
            :aria-describedby="fieldErrors.category ? 'category-error' : undefined"
            ref="categoryInputRef"
          />
          <p :class="errorStyle" v-if="fieldErrors.category" id="category-error">
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
            :aria-invalid="Boolean(fieldErrors.price)"
            :aria-describedby="fieldErrors.price ? 'price-error' : undefined"
            ref="priceInputRef"
          />
          <p :class="errorStyle" v-if="fieldErrors.price" id="price-error">
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
            :aria-invalid="Boolean(fieldErrors.stock)"
            :aria-describedby="fieldErrors.stock ? 'stock-error' : undefined"
            ref="stockInputRef"
          />
          <p :class="errorStyle" v-if="fieldErrors.stock" id="stock-error">
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
                class="sr-only peer"
                :aria-invalid="Boolean(uploadErrorMessage)"
                :aria-describedby="
                  uploadErrorMessage
                    ? 'product-image-help product-image-error'
                    : 'product-image-help'
                "
              />
              <label
                for="product-image"
                :class="[
                  uploadButtonStyle,
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-primary',
                ]"
              >
                이미지 선택
              </label>
              <p v-if="selectedFileName" class="text-sm text-text-muted">
                파일명 : {{ selectedFileName }}
              </p>
            </div>
          </div>

          <p class="text-sm text-text-muted" id="product-image-help">JPG, PNG, WEBP / 최대 5MB</p>
          <p :class="errorStyle" v-if="uploadErrorMessage" id="product-image-error">
            {{ uploadErrorMessage }}
          </p>
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
        </div>

        <div>
          <div class="flex flex-wrap gap-3 pt-2">
            <button type="submit" :class="buttonPrimaryStyle" :disabled="isLoading">수정</button>
            <button type="button" :class="buttonDefaultStyle" :disabled="isLoading">취소</button>
          </div>
          <p v-if="createErrorMessage" :class="errorStyle" role="alert">{{ createErrorMessage }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getProductsDetailApi, updateProductApi, uploadProductImageApi } from '@/api/products'

import { isApiError } from '@/types/api'
import type { ProductForm, ProductsFormErrors, UpdateProductPayload } from '@/types/products'
import { useAuthStore } from '@/stores/auth'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthErrorHandler } from '@/composables/useAuthErrorHandler'
import { focusFirstErrorField } from '@/utils/focus'

const boxStyle = `flex flex-col gap-1`
const labelStyle = `text-sm font-medium text-text-secondary`
const inputStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const selectStyle = `rounded-md border border-border-strong px-3 py-2 text-sm`
const textareaStyle = `min-h-24 rounded-md border border-border-strong px-3 py-2 text-sm`
const errorStyle = `text-sm text-red-600`
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const buttonDefaultStyle = `rounded-md border border-border-strong px-4 py-2 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const uploadButtonStyle = `inline-flex w-fit cursor-pointer items-center justify-center rounded-md border border-border-strong bg-bg-surface px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-muted`

const { handleAuthError } = useAuthErrorHandler()

const nameInputRef = ref<HTMLInputElement | null>(null)
const categoryInputRef = ref<HTMLInputElement | null>(null)
const priceInputRef = ref<HTMLInputElement | null>(null)
const stockInputRef = ref<HTMLInputElement | null>(null)

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
  if (Object.keys(nextErrors).length > 0) {
    focusFirstErrorField([
      { error: nextErrors.name, ref: nameInputRef },
      { error: nextErrors.category, ref: categoryInputRef },
      { error: nextErrors.price, ref: priceInputRef },
      { error: nextErrors.stock, ref: stockInputRef },
    ])
  }
  return Object.keys(nextErrors).length === 0
}

const getProductDetail = async () => {
  initLoading.value = true
  try {
    const response = await getProductsDetailApi(authStore.accessToken, productId)

    const { data } = response
    form.value.name = data.name
    form.value.category = data.category
    form.value.price = data.price
    form.value.status = data.status
    form.value.stock = data.stock
    form.value.thumbnailUrl = data.thumbnailUrl
    form.value.description = data.description

    previewImage.value = form.value?.thumbnailUrl || ''
  } catch (error) {
    if (handleAuthError(error)) return
    if (isApiError(error)) {
      loadErrorMessage.value = error.message
      fieldErrors.value = error.fieldErrors ?? {}
    } else {
      loadErrorMessage.value = '제품 정보를 불러오지 못했습니다.'
    }
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

      payload.thumbnailUrl = uploadResponse.data.url
    }
    if (!payload.description?.trim()) {
      delete payload.description
    }

    await updateProductApi(authStore.accessToken, payload, productId)
    router.push({ name: 'products' })
  } catch (error) {
    if (handleAuthError(error)) return
    if (isApiError(error)) {
      createErrorMessage.value = error.message
      fieldErrors.value = error.fieldErrors ?? {}
    } else {
      createErrorMessage.value = '상품 수정에 실패했습니다.'
    }
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
