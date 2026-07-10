<template>
  <div>
    <ProductFilterBar
      v-model:selectedCategory="selectedCategory"
      v-model:selectedStatus="selectedStatus"
      v-model:selectedSort="selectedSort"
      :categories="productsMeta?.categories ?? []"
      :statuses="productsMeta?.statuses ?? []"
      :canCreateProduct="canCreateProduct"
      @filter="handleFilterProducts"
      @create="handleCreateProduct"
      @reset="handleResetSearch"
    />
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
              <button
                v-if="canUpdateProductStatus"
                type="button"
                :class="[buttonDefaultStyle, canUpdateProduct ? 'ml-2' : '']"
                @click="handleOpenStatusDialog(product, $event)"
              >
                상태 변경
              </button>
              <!-- <button type="button" :class="[buttonDangerStyle, 'ml-2']">삭제</button> -->
            </td>
          </tr>
        </tbody>
      </table>
      <PaginationBar v-if="pagination" :pagination="pagination" @changePage="handleChangePage" />
    </div>
    <ConfirmDialog
      :open="isStatusDialogOpen"
      title="상품 상태 변경"
      :description="`${selectedProductForStatus?.name ?? '선택한'} 상품의 상태를 변경합니다.`"
      :confirmLabel="isUpdatingStatus ? '변경 중' : '상태 변경'"
      :confirmDisabled="isUpdatingStatus"
      :isProcessing="isUpdatingStatus"
      confirmVariant="primary"
      @confirm="handleConfirmProductStatus"
      @cancel="handleCloseStatusDialog"
    >
      <div :class="boxStyle">
        <label for="product-status-change" :class="labelStyle">변경할 상태</label>
        <select
          id="product-status-change"
          v-model="nextProductStatus"
          :disabled="isUpdatingStatus"
          :aria-describedby="statusActionError ? 'product-status-action-error' : undefined"
          :class="selectStyle"
        >
          <option value="selling">판매중</option>
          <option value="hidden">숨김</option>
          <option value="soldout">품절</option>
        </select>
        <p
          :class="errorStyle"
          v-if="statusActionError"
          role="alert"
          id="product-status-action-error"
        >
          {{ statusActionError }}
        </p>
      </div>
    </ConfirmDialog>
  </div>
</template>

<script setup lang="ts">
import { getProducts, getProductsMetaApi, updateProductStatusApi } from '@/api/products'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ProductStatusBadge from '@/components/products/ProductStatusBadge.vue'
import { isApiError, type PaginationMeta } from '@/types/api'
import type { IProduct, ProductsMeta, ProductsQuery, ProductsSort } from '@/types/products'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatCurrency } from '@/utils/currency'
import { useListStatus } from '@/composables/useListStatus'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import { useAuthErrorHandler } from '@/composables/useAuthErrorHandler'
import { getQueryPage, getQueryString } from '@/utils/query'
import ProductFilterBar from '@/components/products/ProductFilterBar.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'

const thStyle = `border-b border-border px-4 py-3 text-left font-medium text-text-secondary`
const tdStyle = `border-b border-border px-4 py-3`
const buttonPrimaryStyle = `rounded-md bg-primary px-4 py-2 text-sm font-medium text-white cursor-pointer hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50`
const buttonDefaultStyle = `rounded-md border border-border-strong px-2 py-1 text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`
const boxStyle = `flex flex-col gap-1`
const labelStyle = `block mb-2 text-sm font-medium text-text-secondary`
const selectStyle = `h-9 w-full rounded-md border border-border-strong bg-white px-3 text-sm focus-visible:outline disabled:bg-muted disabled:cursor-not-allowed`
const errorStyle = `text-sm text-red-600`

const { handleAuthError } = useAuthErrorHandler()
const route = useRoute()
const router = useRouter()

const productStatusValues: IProduct['status'][] = ['selling', 'hidden', 'soldout']
const productSortValues: ProductsSort[] = [
  'createdAt:asc',
  'createdAt:desc',
  'price:asc',
  'price:desc',
  'stock:asc',
  'stock:desc',
]
const getProductsStatusQuery = (value: unknown): IProduct['status'] | '' => {
  const queryValue = getQueryString(value)
  return productStatusValues.includes(queryValue as IProduct['status'])
    ? (queryValue as IProduct['status'])
    : ''
}

const getProductsSortQuery = (value: unknown): ProductsSort | '' => {
  const queryValue = getQueryString(value)
  return productSortValues.includes(queryValue as ProductsSort) ? (queryValue as ProductsSort) : ''
}

const products = ref<IProduct[]>([])
const pagination = ref<PaginationMeta | null>(null)
const productsMeta = ref<ProductsMeta | null>(null)
const selectedProductForStatus = ref<IProduct | null>(null)
const nextProductStatus = ref<IProduct['status'] | ''>('')
const lastStatusButtonRef = ref<HTMLButtonElement | null>(null)
const isUpdatingStatus = ref(false)
const statusActionError = ref('')
const isLoading = ref(false)
const selectedCategory = ref(getQueryString(route.query.category))
const selectedStatus = ref(getProductsStatusQuery(route.query.status))
const selectedSort = ref(getProductsSortQuery(route.query.sort))
const errorMessage = ref('')
const authStore = useAuthStore()
const currentPage = ref(getQueryPage(route.query.page))
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

const canUpdateProductStatus = computed(() => {
  return Boolean(productPermissions.value?.updateStatus)
})

const isStatusDialogOpen = computed(() => {
  return selectedProductForStatus.value !== null
})

const createProductsQueryParams = () => {
  return {
    category: selectedCategory.value || undefined,
    status: selectedStatus.value || undefined,
    sort: selectedSort.value || undefined,
    page: currentPage.value === 1 ? undefined : String(currentPage.value),
  }
}

const updateProductsQuery = () => {
  router.replace({
    name: 'products',
    query: createProductsQueryParams(),
  })
}

const fetchProducts = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const productQuery: ProductsQuery = {
      category: selectedCategory.value,
      status: selectedStatus.value || undefined,
      sort: selectedSort.value || undefined,
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

const fetchProductsMeta = async () => {
  try {
    const response = await getProductsMetaApi(authStore.accessToken)
    productsMeta.value = response.data
  } catch (error) {
    if (handleAuthError(error)) return
  }
}

const handleFilterProducts = () => {
  currentPage.value = 1
  updateProductsQuery()
}

const handleChangePage = (page: number) => {
  currentPage.value = page
  updateProductsQuery()
}

const handleCreateProduct = () => {
  router.push({ name: 'productCreate' })
}

const handleResetSearch = () => {
  selectedCategory.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
  selectedSort.value = ''
  updateProductsQuery()
}

const handleProductEdit = (id: number) => {
  router.push({ name: 'productEdit', params: { id: id } })
}

const handleOpenStatusDialog = (product: IProduct, event: MouseEvent) => {
  statusActionError.value = ''
  selectedProductForStatus.value = product
  nextProductStatus.value = product.status
  lastStatusButtonRef.value = event.currentTarget as HTMLButtonElement
}

const closeStatusDialog = () => {
  selectedProductForStatus.value = null
  nextProductStatus.value = ''
  lastStatusButtonRef.value?.focus()
}

const handleCloseStatusDialog = () => {
  if (isUpdatingStatus.value) return

  closeStatusDialog()
}

const handleConfirmProductStatus = async () => {
  if (isUpdatingStatus.value) return
  const product = selectedProductForStatus.value
  const nextStatus = nextProductStatus.value
  if (!product || !nextStatus) return

  if (product.status === nextStatus) {
    statusActionError.value = '현재 상태와 다른 상태를 선택해주세요.'
    return
  }
  isUpdatingStatus.value = true
  statusActionError.value = ''
  try {
    await updateProductStatusApi(authStore.accessToken, { status: nextStatus }, product.id)
    closeStatusDialog()
    await Promise.all([fetchProducts(), fetchProductsMeta()])
  } catch (error) {
    if (handleAuthError(error)) return
    if (isApiError(error)) {
      statusActionError.value = error.message
    } else {
      statusActionError.value = '상품 상태를 변경하지 못했습니다.'
    }
  } finally {
    isUpdatingStatus.value = false
  }
}

onMounted(() => {
  fetchProductsMeta()
})

watch(
  () => route.query,
  () => {
    selectedCategory.value = getQueryString(route.query.category)
    selectedStatus.value = getProductsStatusQuery(route.query.status)
    currentPage.value = getQueryPage(route.query.page)
    selectedSort.value = getProductsSortQuery(route.query.sort)
    fetchProducts()
  },
  { immediate: true },
)
</script>
