import type { ProductsQuery } from './types'

export const getProducts = async (accessToken: string, query: ProductsQuery) => {
  const params = new URLSearchParams()
  params.set('limit', String(query.limit))
  params.set('page', String(query.page))
  const queryString = params.toString()
  const url = queryString
    ? `${import.meta.env.VITE_APP_API_URL}/api/products?${queryString}`
    : `${import.meta.env.VITE_APP_API_URL}/api/products`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response
}
