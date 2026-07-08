<template>
  <div>
    <div class="mb-6 flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-text-primary">상품목록</h2>
        <p class="mt-1 text-sm text-text-secondary">상품 정보를 조회하고 관리합니다.</p>
      </div>

      <button
        v-if="canCreateProduct"
        type="button"
        :class="buttonPrimaryStyle"
        @click="handleCreateProduct"
      >
        상품생성
      </button>
    </div>

    <LoadingState v-if="isInitialLoading" message="상품목록을 불러오는 중입니다." />
    <ErrorState v-else-if="errorMessage" :message="errorMessage" @retry="fetchProducts" />
    <EmptyState
      v-else-if="isEmpty"
      title="표시할 상품이 없습니다."
      description="상품을 생성하면 이 목록에 표시됩니다."
    >
      <button
        v-if="canCreateProduct"
        type="button"
        :class="buttonPrimaryStyle"
        @click="handleCreateProduct"
      >
        상품 생성
      </button>
    </EmptyState>

    <div v-else>
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th :class="thStyle">이미지</th>
            <th :class="thStyle">상품명</th>
            <th :class="thStyle">카테고리</th>
            <th :class="thStyle">가격</th>
            <th :class="thStyle">재고</th>
            <th :class="thStyle">상태</th>
            <th :class="thStyle">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isTableLoading">
            <td :class="[tdStyle, 'text-center']" colspan="7">제품목록을 불러오는 중입니다.</td>
          </tr>
          <tr v-for="product in products" :key="product.id">
            <td :class="tdStyle">
              <img
                v-if="product.thumbnailUrl"
                :src="product.thumbnailUrl"
                :alt="product.name"
                class="h-12 w-12 rounded-md object-cover"
              />
              <div
                v-else
                class="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-xs text-text-secondary"
              >
                No image
              </div>
            </td>
            <td :class="tdStyle">{{ product.name }}</td>
            <td :class="tdStyle">{{ product.category }}</td>
            <td :class="tdStyle">{{ formatCurrency(product.price) }}</td>
            <td :class="tdStyle">{{ product.stock }}</td>
            <td :class="tdStyle">
              <ProductStatusBadge :status="product.status" />
            </td>
            <td :class="tdStyle">
              <button
                v-if="canUpdateProduct"
                :class="buttonDefaultStyle"
                @click="handleProductEdit(product.id)"
              >
                수정
              </button>
              <!-- <button type="button" :class="[buttonDangerStyle, 'ml-2']">삭제</button> -->
            </td>
          </tr>
        </tbody>
      </table>
      <PaginationBar v-if="pagination" :pagination="pagination" @changePage="handleChangePage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getProducts } from '@/api/products'
import PaginationBar from '@/components/products/PaginationBar.vue'
import ProductStatusBadge from '@/components/products/ProductStatusBadge.vue'
import { isApiError, type PaginationMeta } from '@/types/api'
import type { IProduct, ProductsQuery } from '@/types/products'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatCurrency } from '@/utils/currency'
import { useListStatus } from '@/composables/useListStatus'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useAuthErrorHandler } from '@/composables/useAuthErrorHandler'

const thStyle = `border-b border-border px-4 py-3 text-left font-medium text-text-secondary`
const tdStyle = `border-b border-border px-4 py-3`
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50`
const buttonDefaultStyle = `rounded-md border border-border-strong px-2 py-1 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`

const { handleAuthError } = useAuthErrorHandler()
const router = useRouter()
const products = ref<IProduct[]>([])
const pagination = ref<PaginationMeta | null>(null)
const isLoading = ref(false)

const errorMessage = ref('')
const authStore = useAuthStore()
const currentPage = ref(1)
const limit = ref(10)

const { isEmpty, isInitialLoading, isTableLoading } = useListStatus(products, isLoading)

const productPermissions = computed(() => {
  return authStore.user?.permissions.products
})

const canCreateProduct = computed(() => {
  return Boolean(productPermissions.value?.create)
})
const canUpdateProduct = computed(() => {
  return Boolean(productPermissions.value?.update)
})

const fetchProducts = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const productQuery: ProductsQuery = {
      page: currentPage.value,
      limit: limit.value,
    }
    const response = await getProducts(authStore.accessToken, productQuery)

    products.value = response.items
    pagination.value = response.pagination
  } catch (error) {
    if (handleAuthError(error)) return
    if (isApiError(error)) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '상품 목록을 불러오지 못했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  fetchProducts()
}

const handleCreateProduct = () => {
  router.push({ name: 'productCreate' })
}

const handleProductEdit = (id: number) => {
  router.push({ name: 'productEdit', params: { id: id } })
}

onMounted(() => {
  fetchProducts()
})
</script>
