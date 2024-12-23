import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, it } from 'bun:test'

import {
    datePlainToDate,
    dateTimeZonedToDate,
    dateToDatePlain,
    dateToDateTimeZoned,
    deserializeDatePlain,
    deserializeDateTime,
    deserializeDateTimeZoned,
    serializeDatePlain,
    serializeDateTime,
    serializeDateTimeZoned,
} from './date-utils'

describe('date-utils', () => {
    describe('Date', () => {
        describe('serializeDateTime', () => {
            it('should return null if the date is invalid', () => {
                expect(serializeDateTime(new Date('INVALID'))).toBe(null)
            })

            it('should return the date as an ISO string', () => {
                const date = new Date(2025, 1, 3, 4, 5)

                const result = serializeDateTime(date)

                expect(result).toBe('2025-02-03T04:05:00.000Z')
            })
        })

        describe('deserializeDateTime', () => {
            it('should throw if the date is invalid', () => {
                expect(() => deserializeDateTime('INVALID')).toThrowError()
            })

            it('should return the date', () => {
                const date = new Date(2025, 1, 3, 4, 5)

                const result = deserializeDateTime('2025-02-03T04:05:00.000Z')

                expect(result).toEqual(date)
            })
        })
    })

    describe('DatePlain', () => {
        describe('serializeDatePlain', () => {
            it('should return the date as a string', () => {
                const date = Temporal.PlainDate.from({ year: 2025, month: 2, day: 3 })

                const result = serializeDatePlain(date)

                expect(result).toBe('2025-02-03')
            })
        })

        describe('deserializeDatePlain', () => {
            it('should throw if the date is invalid', () => {
                expect(() => deserializeDatePlain('INVALID')).toThrowError()
            })

            it('should return the date', () => {
                const date = Temporal.PlainDate.from({ year: 2025, month: 2, day: 3 })

                const result = deserializeDatePlain('2025-02-03')

                expect(result).toEqual(date)
            })
        })

        describe('dateToDatePlain', () => {
            it('should convert a date to a PlainDate', () => {
                const date = new Date(2025, 1, 3)

                const result = dateToDatePlain(date)

                expect(result).toEqual(
                    Temporal.PlainDate.from({
                        year: 2025,
                        month: 2,
                        day: 3,
                    }),
                )
            })
        })

        describe('datePlainToDate', () => {
            it('should convert a PlainDate to a date', () => {
                const date = Temporal.PlainDate.from({
                    year: 2025,
                    month: 2,
                    day: 3,
                })

                const result = datePlainToDate(date)

                expect(result).toEqual(new Date(2025, 1, 3))
            })
        })
    })

    describe('ZonedDateTime', () => {
        describe('serializeDateTimeZoned', () => {
            it('should return the date as a string', () => {
                const date = Temporal.ZonedDateTime.from({
                    year: 2025,
                    month: 2,
                    day: 3,
                    hour: 4,
                    minute: 5,
                    timeZone: Temporal.Now.timeZoneId(),
                })

                const result = serializeDateTimeZoned(date)

                expect(result).toBe(date.toString())
            })
        })

        describe('deserializeDateTimeZoned', () => {
            it('should throw if the date is invalid', () => {
                expect(() => deserializeDateTimeZoned('INVALID')).toThrowError()
            })

            it('should return the date', () => {
                const date = Temporal.ZonedDateTime.from({
                    year: 2025,
                    month: 2,
                    day: 3,
                    hour: 4,
                    minute: 5,
                    timeZone: Temporal.Now.timeZoneId(),
                })

                const result = deserializeDateTimeZoned(date.toString())

                expect(result).toEqual(date)
            })
        })

        describe('dateToDateTimeZoned', () => {
            it('should convert a date to a ZonedDateTime', () => {
                const date = new Date(2025, 1, 3, 4, 5, 6, 7)

                const result = dateToDateTimeZoned(date)

                expect(result.year).toBe(2025)
                expect(result.month).toBe(2)
                expect(result.day).toBe(3)
                expect(result.hour).toBe(4)
                expect(result.minute).toBe(5)
                expect(result.second).toBe(6)
                expect(result.millisecond).toBe(7)

                expect(result.timeZoneId).toBe(Temporal.Now.timeZoneId())
            })
        })

        describe('dateTimeZonedToDate', () => {
            it('should convert a ZonedDateTime to a date', () => {
                const date = Temporal.ZonedDateTime.from({
                    year: 2025,
                    month: 2,
                    day: 3,
                    hour: 4,
                    minute: 5,
                    second: 6,
                    millisecond: 7,
                    timeZone: Temporal.Now.timeZoneId(),
                })

                const result = dateTimeZonedToDate(date)

                expect(result).toEqual(new Date(2025, 1, 3, 4, 5, 6, 7))
            })
        })
    })
})
