import type {
  ProductsQuery,
  CreateProductPayload,
  UpdateProductPayload,
  IProductsResponse,
  ProductDetailResponse,
  UploadImageResponse,
  ProductsMetaResponse,
  UpdateProductStatusPayload,
} from '@/types/products'
import { apiClient } from './client'

export const getProducts = async (accessToken: string, query: ProductsQuery) => {
  const params = new URLSearchParams()
  params.set('limit', String(query.limit))
  params.set('page', String(query.page))
  if (query.category) {
    params.set('category', query.category)
  }
  if (query.status) {
    params.set('status', query.status)
  }
  if (query.sort) {
    params.set('sort', query.sort)
  }
  const queryString = params.toString()
  const url = queryString ? `/products?${queryString}` : `/products`

  return apiClient<IProductsResponse>(url, { accessToken })
}

export const uploadProductImageApi = async (accessToken: string, file: File) => {
  const body = new FormData()
  body.append('file', file)

  return apiClient<UploadImageResponse>(`/uploads`, { method: 'POST', accessToken, body })
}

export const createProductApi = async (accessToken: string, payload: CreateProductPayload) => {
  return apiClient<ProductDetailResponse>(`/products`, {
    method: 'POST',
    accessToken,
    body: payload,
  })
}

export const getProductsDetailApi = async (accessToken: string, id: number) => {
  return apiClient<ProductDetailResponse>(`/products/${id}`, { accessToken })
}

export const getProductsMetaApi = async (accessToken: string) => {
  return apiClient<ProductsMetaResponse>(`/products/meta`, { accessToken })
}

export const updateProductApi = async (
  accessToken: string,
  payload: UpdateProductPayload,
  id: number,
) => {
  return apiClient<ProductDetailResponse>(`/products/${id}`, {
    method: 'PUT',
    accessToken,
    body: payload,
  })
}

export const updateProductStatusApi = async (
  accessToken: string,
  payload: UpdateProductStatusPayload,
  id: number,
) => {
  return apiClient<ProductDetailResponse>(`/products/${id}/status`, {
    method: 'PATCH',
    accessToken,
    body: payload,
  })
}
