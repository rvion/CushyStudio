import { describe, expect, it } from 'bun:test'

import { type NumberFormat } from './i18n'
import { formatNumberEN, formatNumberFR, parseNumberEN, parseNumberFR } from './number-utils'

describe('number-utils', () => {
    describe('FR', () => {
        describe('formatFR', () => {
            describe('float', () => {
                it('should format small numbers', () => {
                    expect(formatNumberFR(0.1, 'float')).toBe('0,1')
                    expect(formatNumberFR(1, 'float')).toBe('1')
                    expect(formatNumberFR(1.1, 'float')).toBe('1,1')
                    expect(formatNumberFR(1.11, 'float')).toBe('1,11')
                    expect(formatNumberFR(1.111, 'float')).toBe('1,111')
                    expect(formatNumberFR(1.1111, 'float')).toBe('1,111')
                })

                it('should format large numbers', () => {
                    expect(formatNumberFR(1000, 'float')).toBe('1 000')
                    expect(formatNumberFR(1000000, 'float')).toBe('1 000 000')
                    expect(formatNumberFR(1000000000, 'float')).toBe('1 000 000 000')
                })

                it('should format negative numbers', () => {
                    expect(formatNumberFR(-1, 'float')).toBe('-1')
                    expect(formatNumberFR(-1.1, 'float')).toBe('-1,1')
                    expect(formatNumberFR(-1000.11, 'float')).toBe('-1 000,11')
                })
            })

            describe('amount', () => {
                it('should format small numbers', () => {
                    expect(formatNumberFR(0.1, 'amount')).toBe('0,10')
                })

                it('should format large numbers', () => {
                    expect(formatNumberFR(1000, 'amount')).toBe('1 000,00')
                    expect(formatNumberFR(1000000, 'amount')).toBe('1 000 000,00')
                    expect(formatNumberFR(1000000000, 'amount')).toBe('1 000 000 000,00')
                })
            })

            describe('int', () => {
                it('should format positive numbers', () => {
                    expect(formatNumberFR(1, 'int')).toBe('1')
                    expect(formatNumberFR(1000, 'int')).toBe('1 000')
                    expect(formatNumberFR(1000000, 'int')).toBe('1 000 000')
                    expect(formatNumberFR(1000000000, 'int')).toBe('1 000 000 000')
                })

                it('should round numbers', () => {
                    expect(formatNumberFR(1.1, 'int')).toBe('1')
                    expect(formatNumberFR(1.5, 'int')).toBe('2')
                    expect(formatNumberFR(1.9, 'int')).toBe('2')
                })

                it('should format negative numbers', () => {
                    expect(formatNumberFR(-1, 'int')).toBe('-1')
                    expect(formatNumberFR(-1000, 'int')).toBe('-1 000')
                    expect(formatNumberFR(-1000000, 'int')).toBe('-1 000 000')
                    expect(formatNumberFR(-1000000000, 'int')).toBe('-1 000 000 000')
                })
            })
        })

        describe('parseFR', () => {
            describe.each(['float', 'amount'] as const)('format=%s', (format: NumberFormat) => {
                describe.each([0.1, 1, 1.1, 1.11, 1e3, 1e6, 10000.56, 0])('should parse the number %d', (v: number) => {
                    it('should parse the formatted number', () => {
                        const formatted = formatNumberFR(v, format)
                        expect(parseNumberFR(formatted, format)).toBe(v)
                    })
                })

                it.each(['INVALID', ''])('should return false for invalid numbers %s', (v: string) => {
                    expect(parseNumberFR(v, format)).toBeNaN()
                })
            })

            describe('format=int', () => {
                describe.each([1, 1e3, 1e6, 10000, 0, -1])('should parse the number %d', (v: number) => {
                    it('should parse the formatted number', () => {
                        const formatted = formatNumberFR(v, 'int')
                        expect(parseNumberFR(formatted, 'int')).toBe(v)
                    })
                })

                it.each(['INVALID', ''])('should return false for invalid numbers %s', (v: string) => {
                    expect(parseNumberFR(v, 'int')).toBeNaN()
                })
            })
        })
    })

    describe('EN', () => {
        describe('formatEN', () => {
            describe('float', () => {
                it('should format small numbers', () => {
                    expect(formatNumberEN(0.1, 'float')).toBe('0.1')
                    expect(formatNumberEN(1, 'float')).toBe('1')
                    expect(formatNumberEN(1.1, 'float')).toBe('1.1')
                    expect(formatNumberEN(1.11, 'float')).toBe('1.11')
                    expect(formatNumberEN(1.111, 'float')).toBe('1.111')
                    expect(formatNumberEN(1.1111, 'float')).toBe('1.111')
                })

                it('should format large numbers', () => {
                    expect(formatNumberEN(1000, 'float')).toBe('1,000')
                    expect(formatNumberEN(1000000, 'float')).toBe('1,000,000')
                    expect(formatNumberEN(1000000000, 'float')).toBe('1,000,000,000')
                })

                it('should format negative numbers', () => {
                    expect(formatNumberEN(-1, 'float')).toBe('-1')
                    expect(formatNumberEN(-1.1, 'float')).toBe('-1.1')
                    expect(formatNumberEN(-1000.11, 'float')).toBe('-1,000.11')
                })
            })

            describe('amount', () => {
                it('should format small numbers', () => {
                    expect(formatNumberEN(0.1, 'amount')).toBe('0.10')
                })

                it('should format large numbers', () => {
                    expect(formatNumberEN(1000, 'amount')).toBe('1,000.00')
                    expect(formatNumberEN(1000000, 'amount')).toBe('1,000,000.00')
                    expect(formatNumberEN(1000000000, 'amount')).toBe('1,000,000,000.00')
                })
            })

            describe('int', () => {
                it('should format integers', () => {
                    expect(formatNumberEN(1, 'int')).toBe('1')
                    expect(formatNumberEN(1000, 'int')).toBe('1,000')
                    expect(formatNumberEN(1000000, 'int')).toBe('1,000,000')
                    expect(formatNumberEN(1000000000, 'int')).toBe('1,000,000,000')
                })

                it('should round numbers', () => {
                    expect(formatNumberEN(1.1, 'int')).toBe('1')
                    expect(formatNumberEN(1.5, 'int')).toBe('2')
                    expect(formatNumberEN(1.9, 'int')).toBe('2')
                })

                it('should format negative numbers', () => {
                    expect(formatNumberEN(-1, 'int')).toBe('-1')
                    expect(formatNumberEN(-1000, 'int')).toBe('-1,000')
                    expect(formatNumberEN(-1000000, 'int')).toBe('-1,000,000')
                    expect(formatNumberEN(-1000000000, 'int')).toBe('-1,000,000,000')
                })
            })
        })

        describe('parseEN', () => {
            describe.each(['float', 'amount'] as const)('format=%s', (format: NumberFormat) => {
                describe.each([0.1, 1, 1.1, 1.11, 1e3, 1e6, 10000.56, 0])('should parse the number %d', (v: number) => {
                    it('should parse the formatted number', () => {
                        const formatted = formatNumberEN(v, format)
                        expect(parseNumberEN(formatted, format)).toBe(v)
                    })
                })

                it.each(['INVALID', ''])('should return false for invalid numbers %s', (v: string) => {
                    expect(parseNumberEN(v, format)).toBeNaN()
                })
            })

            describe('format=int', () => {
                describe.each([1, 1e3, 1e6, 10000, 0, -1])('should parse the number %d', (v: number) => {
                    it('should parse the formatted number', () => {
                        const formatted = formatNumberEN(v, 'int')
                        expect(parseNumberEN(formatted, 'int')).toBe(v)
                    })
                })

                it.each(['INVALID', ''])('should return false for invalid numbers %s', (v: string) => {
                    expect(parseNumberEN(v, 'int')).toBeNaN()
                })
            })
        })
    })
})
