import type { ProductsQuery, CreateProductPayload, UpdateProductPayload } from './types'

const baseUrl = `${import.meta.env.VITE_APP_API_URL}/api`

export const getProducts = async (accessToken: string, query: ProductsQuery) => {
  const params = new URLSearchParams()
  params.set('limit', String(query.limit))
  params.set('page', String(query.page))
  const queryString = params.toString()
  const url = queryString ? `${baseUrl}/products?${queryString}` : `${baseUrl}/products`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response
}

export const uploadProductImageApi = async (accessToken: string, file: File) => {
  const body = new FormData()
  body.append('file', file)

  const response = await fetch(`${baseUrl}/uploads`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  })

  return response
}

export const createProductApi = async (accessToken: string, payload: CreateProductPayload) => {
  const body = JSON.stringify(payload)

  const response = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body,
  })

  return response
}

export const getProductsDetailApi = async (accessToken: string, id: number) => {
  const response = await fetch(`${baseUrl}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response
}

export const updateProductApi = async (
  accessToken: string,
  payload: UpdateProductPayload,
  id: number,
) => {
  const body = JSON.stringify(payload)
  const response = await fetch(`${baseUrl}/products/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body,
  })

  return response
}
