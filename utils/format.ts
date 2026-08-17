import type { Product, RatingKey } from '../types/product'
import { RATING_DIMENSIONS } from '../types/product'

const LANGUAGE_LABELS: Record<string, string> = {
  de: 'German',
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  nl: 'Dutch',
  pt: 'Portuguese'
}

export function formatEuroPerMonth(price: number | null): string {
  if (price === null) return 'Price on request'
  if (price === 0) return '€0/mo'
  return `€${price.toLocaleString('en-US')}/mo`
}

export function formatLanguages(codes: string[]): string {
  if (!codes.length) return 'Not listed'
  return codes.map((code) => LANGUAGE_LABELS[code] ?? code.toUpperCase()).join(', ')
}

export function formatYesNo(value: boolean): string {
  return value ? 'Yes' : 'No'
}

export function formatCompareHeading(names: readonly string[]): string {
  if (names.length < 2) return 'Compare CRM tools'
  if (names.length === 2) return `${names[0]} vs ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
}

export function letterMark(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? '')
    .join('')
    .toUpperCase()
}

export function ratingOrNull(value: number | undefined): number | null {
  return typeof value === 'number' ? value : null
}

export function overallRating(product: Product): number | null {
  const values = RATING_DIMENSIONS
    .map((dimension) => product.ratings[dimension.key as RatingKey])
    .filter((value): value is number => typeof value === 'number')

  if (!values.length) return null
  const sum = values.reduce((total, value) => total + value, 0)
  return Math.round((sum / values.length) * 10) / 10
}

export function startingPrice(product: Product): number | null | undefined {
  if (!product.pricing_tiers.length) return undefined
  const priced = product.pricing_tiers
    .map((tier) => tier.price_eur_month)
    .filter((price): price is number => price !== null)
  if (!priced.length) return null
  return Math.min(...priced)
}

export function startingPriceLabel(product: Product): string {
  const start = startingPrice(product)
  if (start === undefined) return 'Pricing not listed'
  if (start === null) return 'Price on request'
  if (start === 0) return 'Starts free'
  return `From ${formatEuroPerMonth(start)}`
}
