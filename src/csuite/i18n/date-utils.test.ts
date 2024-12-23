import { describe, expect, it } from 'bun:test'

import { formatDateTimeEN_US, formatDateTimeFR, parseDateTimeEN_US, parseDateTimeFR } from './date-utils'

describe('date-utils', () => {
    describe('FR', () => {
        describe('formatDateTimeFR', () => {
            describe('mode datetime', () => {
                it('should pad numbers with 0', () => {
                    const date = new Date(2025, 1, 3, 4, 5)

                    const result = formatDateTimeFR(date, 'datetime')

                    expect(result).toBe('03/02/2025 04:05')
                })

                it('should use the 24h format', () => {
                    const date = new Date(2025, 1, 3, 22, 5)

                    const result = formatDateTimeFR(date, 'datetime')

                    expect(result).toBe('03/02/2025 22:05')
                })
            })

            describe('mode date', () => {
                it('should pad numbers with 0', () => {
                    const date = new Date(2025, 1, 3, 4, 5)

                    const result = formatDateTimeFR(date, 'date')

                    expect(result).toBe('03/02/2025')
                })
            })
        })

        describe('parseDateTimeFR', () => {
            it('should parse a valid date with leading zeros', () => {
                const result = parseDateTimeFR('03/02/2025 04:05')

                expect(result).toEqual(new Date(2025, 1, 3, 4, 5))
            })

            it('should parse a valid date with 24h format', () => {
                const result = parseDateTimeFR('03/02/2025 22:05')

                expect(result).toEqual(new Date(2025, 1, 3, 22, 5))
            })

            it('should parse a time with "h" separator', () => {
                const result = parseDateTimeFR('03/02/2025 4h05')

                expect(result).toEqual(new Date(2025, 1, 3, 4, 5))
            })

            it('should parse a time in a shorter form', () => {
                const result = parseDateTimeFR('03/02/2025 4h')

                expect(result).toEqual(new Date(2025, 1, 3, 4))
            })

            it('should correctly parse dates without leading zeros', () => {
                const result = parseDateTimeFR('3/2/2025 4:5')

                expect(result).toEqual(new Date(2025, 1, 3, 4, 5))
            })

            it('should parse dates with 2 digits year', () => {
                const result = parseDateTimeFR('3/2/25 4:5')

                expect(result).toEqual(new Date(2025, 1, 3, 4, 5))
            })

            it('should throw if the date is invalid', () => {
                expect(() => parseDateTimeFR('invalid')).toThrow()
            })

            describe('obvious invalid dates', () => {
                it('should throw if the day is > 31', () => {
                    expect(() => parseDateTimeFR('32/02/2025')).toThrow()
                })

                it('should throw if the month is > 12', () => {
                    expect(() => parseDateTimeFR('03/13/2025')).toThrow()
                })

                it('should throw if the hour is > 23', () => {
                    expect(() => parseDateTimeFR('03/02/2025 24:05')).toThrow()
                })

                it('should throw if the minute is > 59', () => {
                    expect(() => parseDateTimeFR('03/02/2025 04:60')).toThrow()
                })
            })
        })

        describe('chaining', () => {
            it('should generate the same date in mode = datetime', () => {
                const input = new Date(2025, 1, 3, 4, 5)

                const result = parseDateTimeFR(formatDateTimeFR(input, 'datetime'))

                expect(result).toEqual(input)
            })

            it('should generate the same date in mode = date', () => {
                const input = new Date(2025, 1, 3)

                const result = parseDateTimeFR(formatDateTimeFR(input, 'date'))

                expect(result).toEqual(input)
            })
        })
    })

    describe('US', () => {
        describe('formatDateTimeEN_US', () => {
            describe('mode datetime', () => {
                it('should pad numbers with 0', () => {
                    const date = new Date(2025, 1, 3, 4, 5)

                    const result = formatDateTimeEN_US(date, 'datetime')

                    expect(result).toBe('2/3/25, 4:05 AM')
                })

                it('should use the 24h format', () => {
                    const date = new Date(2025, 1, 3, 22, 5)

                    const result = formatDateTimeEN_US(date, 'datetime')

                    expect(result).toBe('2/3/25, 10:05 PM')
                })
            })

            describe('mode date', () => {
                it('should pad numbers with 0', () => {
                    const date = new Date(2025, 1, 3, 4, 5)

                    const result = formatDateTimeEN_US(date, 'date')

                    expect(result).toBe('2/3/25')
                })
            })
        })

        describe('parseDateTimeEN_US', () => {
            it('should parse a valid date with leading zeros without AM/PM', () => {
                const result = parseDateTimeEN_US('02/03/2025 04:05')

                expect(result).toEqual(new Date(2025, 1, 3, 4, 5))
            })

            it('should parse a valid date with 24h format', () => {
                const result = parseDateTimeEN_US('02/03/2025 22:05')

                expect(result).toEqual(new Date(2025, 1, 3, 22, 5))
            })

            it('should correctly parse dates without leading zeros', () => {
                const result = parseDateTimeEN_US('2/3/2025 4:5')

                expect(result).toEqual(new Date(2025, 1, 3, 4, 5))
            })

            it('should parse dates with 2 digits year', () => {
                const result = parseDateTimeEN_US('2/3/25 4:5')

                expect(result).toEqual(new Date(2025, 1, 3, 4, 5))
            })

            it('should parse dates with PM', () => {
                const result = parseDateTimeEN_US('2/3/25, 10:05 PM')

                expect(result).toEqual(new Date(2025, 1, 3, 22, 5))
            })

            it('should parse dates with pm', () => {
                const result = parseDateTimeEN_US('2/3/25, 10:05 pm')

                expect(result).toEqual(new Date(2025, 1, 3, 22, 5))
            })

            it('should parse dates with AM', () => {
                const result = parseDateTimeEN_US('2/3/25, 10:05 AM')

                expect(result).toEqual(new Date(2025, 1, 3, 10, 5))
            })

            it('should parse dates with am', () => {
                const result = parseDateTimeEN_US('2/3/25, 10:05 AM')

                expect(result).toEqual(new Date(2025, 1, 3, 10, 5))
            })

            it('should parse dates with AM/PM in a shorter form', () => {
                const result = parseDateTimeEN_US('2/3/25 10PM')

                expect(result).toEqual(new Date(2025, 1, 3, 22))
            })

            it('should parse a date alone', () => {
                const result = parseDateTimeEN_US('2/3/25')

                expect(result).toEqual(new Date(2025, 1, 3))
            })

            it('should parse a date alone with extra chars at the end', () => {
                const result = parseDateTimeEN_US('2/3/25, ')

                expect(result).toEqual(new Date(2025, 1, 3))
            })

            it('should throw if the date is invalid', () => {
                expect(() => parseDateTimeEN_US('invalid')).toThrow()
            })

            describe('obvious invalid dates', () => {
                it('should throw if the day is > 31', () => {
                    expect(() => parseDateTimeEN_US('02/32/2025')).toThrow()
                })

                it('should throw if the month is > 12', () => {
                    expect(() => parseDateTimeEN_US('13/03/2025')).toThrow()
                })

                it('should throw if the hour is > 23', () => {
                    expect(() => parseDateTimeEN_US('02/03/2025 24:05')).toThrow()
                })

                it('should throw if the minute is > 59', () => {
                    expect(() => parseDateTimeEN_US('02/03/2025 04:60')).toThrow()
                })
            })
        })

        describe('chaining', () => {
            it('should generate the same date in mode = datetime', () => {
                const input = new Date(2025, 1, 3, 4, 5)

                const result = parseDateTimeEN_US(formatDateTimeEN_US(input, 'datetime'))

                expect(result).toEqual(input)
            })

            it('should generate the same date in mode = date', () => {
                const input = new Date(2025, 1, 3)

                const result = parseDateTimeEN_US(formatDateTimeEN_US(input, 'date'))

                expect(result).toEqual(input)
            })
        })
    })
})
