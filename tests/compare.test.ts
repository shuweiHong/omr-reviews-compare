import { describe, expect, it } from 'vitest'
import { idsWithHighest, idsWithLowest } from '../utils/compare'

describe('idsWithHighest', () => {
  it('marks the highest numeric score and ignores a missing rating', () => {
    expect(idsWithHighest([
      { id: 'a', value: 4.1 },
      { id: 'b', value: null },
      { id: 'c', value: 4.6 }
    ])).toEqual(['c'])
  })

  it('does not mark a row when every comparable value is a tie', () => {
    expect(idsWithHighest([
      { id: 'a', value: 4.0 },
      { id: 'b', value: 4.0 }
    ])).toEqual([])
  })
})

describe('idsWithLowest', () => {
  it('treats free as the lowest starting price and skips price on request', () => {
    expect(idsWithLowest([
      { id: 'free', value: 0 },
      { id: 'paid', value: 14 },
      { id: 'request', value: null }
    ])).toEqual(['free'])
  })
})
