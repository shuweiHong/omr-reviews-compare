export const RATING_DIMENSIONS = [
  { key: 'ease_of_use', label: 'Ease of use' },
  { key: 'support', label: 'Support' },
  { key: 'value_for_money', label: 'Value for money' },
  { key: 'features', label: 'Features' }
] as const

export type RatingKey = (typeof RATING_DIMENSIONS)[number]['key']

export interface PricingTier {
  name: string
  price_eur_month: number | null
}

export interface ProductAttributes {
  free_trial: boolean
  hosting: string
  eu_data_center: boolean
  iso_27001: boolean
  certifications: string[]
  gdpr_compliant: boolean
  languages: string[]
  api: boolean
  sso: boolean
  mobile_app: boolean
  hq_country: string
}

export interface Product {
  id: string
  name: string
  category: string
  logo_url: string | null
  ratings: Partial<Record<RatingKey, number>>
  pricing_tiers: PricingTier[]
  attributes: ProductAttributes
}
