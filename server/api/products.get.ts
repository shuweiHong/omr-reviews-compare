import { listProducts, listProductsByCategory } from '~/data/products'

export default defineEventHandler((event) => {
  const category = getQuery(event).category
  if (typeof category === 'string' && category.length > 0) {
    return listProductsByCategory(category)
  }
  return listProducts()
})
