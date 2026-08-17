import { describe, expect, it } from 'vitest'
import { formatCompareHeading, formatEuroPerMonth, overallRating, ratingOrNull } from '../utils/format'
import type { Product } from '../types/product'

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: 'freshsales',
    name: 'Freshsales',
    category: 'CRM',
    logo_url: null,
    ratings: { ease_of_use: 4.3, support: 4.1, features: 4.0 },
    pricing_tiers: [{ name: 'Enterprise', price_eur_month: null }],
    attributes: {
      free_trial: true,
      hosting: 'Cloud',
      eu_data_center: true,
      iso_27001: true,
      certifications: [],
      gdpr_compliant: true,
      languages: ['en'],
      api: true,
      sso: true,
      mobile_app: true,
      hq_country: 'IN'
    },
    ...overrides
  }
}

describe('missing catalogue data', () => {
  it('labels a null price as on request instead of inventing a number', () => {
    expect(formatEuroPerMonth(null)).toBe('Price on request')
    expect(formatEuroPerMonth(0)).toBe('€0/mo')
    expect(formatEuroPerMonth(1470)).toBe('€1,470/mo')
  })

  it('does not treat a missing rating dimension as a zero score', () => {
    const missing = product({
      ratings: { ease_of_use: 4.3, support: 4.1, features: 4.0 }
    })

    expect(ratingOrNull(missing.ratings.value_for_money)).toBeNull()
    expect(overallRating(missing)).not.toBe(0)
    expect(overallRating(missing)).toBe(4.1)
  })
})

describe('formatCompareHeading', () => {
  it('uses vs for two names and an and-list for three or more', () => {
    expect(formatCompareHeading(['HubSpot', 'Salesforce'])).toBe('HubSpot vs Salesforce')
    expect(formatCompareHeading(['HubSpot', 'Salesforce', 'Pipedrive'])).toBe(
      'HubSpot, Salesforce, and Pipedrive'
    )
    expect(formatCompareHeading(['HubSpot', 'Salesforce', 'Pipedrive', 'Close'])).toBe(
      'HubSpot, Salesforce, Pipedrive, and Close'
    )
  })
})
