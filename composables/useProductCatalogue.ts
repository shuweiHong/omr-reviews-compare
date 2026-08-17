import type { Product } from '~/types/product'

export function useProductCatalogue(category?: string) {
  return useFetch<Product[]>('/api/products', {
    key: category ? `products-${category}` : 'products',
    query: category ? { category } : undefined
  })
}
