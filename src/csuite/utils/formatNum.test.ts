import { describe, expect, it } from 'bun:test'

import { formatNum } from './formatNum'

describe('formatNum', () => {
    it('work', () => {
        expect(formatNum(1)).toBe('1')
        expect(formatNum(12)).toBe('12')
        expect(formatNum(123)).toBe('123')
        expect(formatNum(1234)).toBe('1 234')
        expect(formatNum(123456789)).toBe('123 456 789')
        expect(formatNum(1234567890)).toBe('1 234 567 890')
        expect(formatNum(12345678901)).toBe('12 345 678 901')
    })
})
