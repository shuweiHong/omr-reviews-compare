import { describe, expect, it } from 'vitest'
import { MAX_COMPARE, MIN_COMPARE, allowedSelectionCopy, canOpenCompare, parseIdsParam, toggleSelection } from '../utils/selection'

const known = Array.from({ length: MAX_COMPARE + 2 }, (_, i) => `tool-${i}`)

describe('toggleSelection', () => {
  it('adds products until MAX_COMPARE, then blocks the next without changing the list', () => {
    const picks = known.slice(0, MAX_COMPARE + 1)
    let last = toggleSelection([], picks[0]!)

    for (let i = 1; i < MAX_COMPARE; i += 1) {
      last = toggleSelection(last.ids, picks[i]!)
      expect(last.status).toBe('added')
    }

    expect(last.ids).toEqual(picks.slice(0, MAX_COMPARE))
    const blocked = toggleSelection(last.ids, picks[MAX_COMPARE]!)
    expect(blocked.status).toBe('blocked')
    expect(blocked.ids).toEqual(picks.slice(0, MAX_COMPARE))
    expect(blocked.message).toContain(String(MAX_COMPARE))
  })

  it('removes a selected product so a different one can be added', () => {
    const filled = known.slice(0, MAX_COMPARE)
    const afterRemove = toggleSelection(filled, filled[1]!)
    const afterAdd = toggleSelection(afterRemove.ids, known[MAX_COMPARE]!)

    expect(afterRemove.status).toBe('removed')
    expect(afterAdd.status).toBe('added')
    expect(afterAdd.ids).toEqual([...filled.filter((id) => id !== filled[1]), known[MAX_COMPARE]])
  })
})

describe('parseIdsParam', () => {
  it('keeps unique known ids and drops anything beyond MAX_COMPARE', () => {
    expect(parseIdsParam(`${known.join(',')},unknown`, known)).toEqual(known.slice(0, MAX_COMPARE))
  })
})

describe('canOpenCompare', () => {
  it('requires at least MIN_COMPARE selections and no more than MAX_COMPARE', () => {
    expect(canOpenCompare([])).toBe(false)
    expect(canOpenCompare(known.slice(0, MIN_COMPARE - 1))).toBe(false)
    expect(canOpenCompare(known.slice(0, MIN_COMPARE))).toBe(true)
    expect(canOpenCompare(known.slice(0, MAX_COMPARE))).toBe(true)
  })
})

describe('allowedSelectionCopy', () => {
  it('mentions both MIN_COMPARE and MAX_COMPARE so UI copy follows the cap', () => {
    const copy = allowedSelectionCopy()
    expect(copy).toContain(String(MIN_COMPARE))
    expect(copy).toContain(String(MAX_COMPARE))
  })
})
