export const MAX_COMPARE = 3
export const MIN_COMPARE = 2

export function allowedSelectionCopy(): string {
  if (MAX_COMPARE <= MIN_COMPARE) return String(MIN_COMPARE)
  if (MAX_COMPARE === MIN_COMPARE + 1) return `${MIN_COMPARE} or ${MAX_COMPARE}`
  return `${MIN_COMPARE} to ${MAX_COMPARE}`
}

export type ToggleStatus = 'added' | 'removed' | 'blocked'

export interface ToggleResult {
  ids: string[]
  status: ToggleStatus
  message?: string
}

export function toggleSelection(
  current: readonly string[],
  id: string,
  max = MAX_COMPARE
): ToggleResult {
  if (current.includes(id)) {
    return {
      ids: current.filter((item) => item !== id),
      status: 'removed'
    }
  }

  if (current.length >= max) {
    return {
      ids: [...current],
      status: 'blocked',
      message: `You can compare up to ${max} tools. Remove one first.`
    }
  }

  return {
    ids: [...current, id],
    status: 'added'
  }
}

export function parseIdsParam(
  raw: unknown,
  knownIds: readonly string[],
  max = MAX_COMPARE
): string[] {
  const known = new Set(knownIds)
  const chunks = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(',') : []
  const unique: string[] = []

  for (const chunk of chunks) {
    const id = String(chunk).trim()
    if (!id || !known.has(id) || unique.includes(id)) continue
    unique.push(id)
    if (unique.length >= max) break
  }

  return unique
}

export function serializeIdsParam(ids: readonly string[]): string {
  return ids.join(',')
}

export function canOpenCompare(ids: readonly string[]): boolean {
  return ids.length >= MIN_COMPARE && ids.length <= MAX_COMPARE
}
