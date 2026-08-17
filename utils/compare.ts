export interface ScoredItem {
  id: string
  value: number | null | undefined
}

export function idsWithHighest(items: readonly ScoredItem[]): string[] {
  const numeric = items.filter((item): item is { id: string; value: number } => typeof item.value === 'number')
  if (numeric.length < 2) return []
  const max = Math.max(...numeric.map((item) => item.value))
  const winners = numeric.filter((item) => item.value === max).map((item) => item.id)
  return winners.length === numeric.length ? [] : winners
}

export function idsWithLowest(items: readonly ScoredItem[]): string[] {
  const numeric = items.filter((item): item is { id: string; value: number } => typeof item.value === 'number')
  if (numeric.length < 2) return []
  const min = Math.min(...numeric.map((item) => item.value))
  const winners = numeric.filter((item) => item.value === min).map((item) => item.id)
  return winners.length === numeric.length ? [] : winners
}
