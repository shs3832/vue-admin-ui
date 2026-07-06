import type { PaginationMeta } from './api'

export type IProduct = {
  id: number
  name: string
  category: string
  price: number
  status: 'selling' | 'hidden' | 'soldout'
  stock: number
  thumbnailUrl: string | null
  description: string | null
  createdAt: string
  updatedAt: string
}

export type IProductsResponse = {
  items: IProduct[]
  pagination: PaginationMeta
}

export type ProductsQuery = {
  page: number
  limit: number
}

export type ProductForm = {
  name: string
  category: string
  price: number
  status: IProduct['status']
  stock: number
  thumbnailUrl?: string | null
  description?: string | null
}

export type ProductDetailResponse = {
  data: IProduct
}

export type CreateProductPayload = ProductForm
export type UpdateProductPayload = Partial<ProductForm>

export type UploadImageResponse = {
  data: {
    url: string
    publicId: string
    filename: string
    size: number
    mimeType: string
  }
}

export type ProductsFormErrors = Partial<Record<keyof ProductForm, string>>
