import type { Product } from '~/types/product'
import seed from '~/data/seed/products.json'

const products = seed as Product[]

export function listProducts(): Product[] {
  return products
}

export function listProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category)
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getProductsByIds(ids: readonly string[]): Product[] {
  return ids
    .map((id) => getProductById(id))
    .filter((product): product is Product => Boolean(product))
}

export function listProductIds(): string[] {
  return products.map((product) => product.id)
}
