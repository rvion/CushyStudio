import { Temporal } from '@js-temporal/polyfill'

// #region Date

export function serializeDateTime(date: Date): string | null {
    if (isNaN(date.getTime())) return null

    return date.toISOString()
}

export function deserializeDateTime(s: string): Date | null {
    const date = new Date(s)

    if (isNaN(date.getTime())) throw new Error('Invalid date')

    return date
}

// #region PlainDate

export function formatDatePlain(date: Temporal.PlainDate): string {
    return `${date.day.toString().padStart(2, '0')}/${date.month.toString().padStart(2, '0')}/${date.year}`
}

export function serializeDatePlain(date: Temporal.PlainDate): string {
    return date.toString()
}

export function deserializeDatePlain(s: string): Temporal.PlainDate {
    return Temporal.PlainDate.from(s)
}

export function dateToDatePlain(date: Date): Temporal.PlainDate {
    return Temporal.PlainDate.from({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
    })
}

export function datePlainToDate(date: Temporal.PlainDate): Date {
    return new Date(date.year, date.month - 1, date.day)
}

// #region ZonedDateTime

export function formatDateTimeZoned(date: Temporal.ZonedDateTime): string {
    return date.toLocaleString('fr-FR', {
        timeStyle: 'short',
        dateStyle: 'short',
    })
}

export function serializeDateTimeZoned(date: Temporal.ZonedDateTime): string {
    return date.toString()
}

export function deserializeDateTimeZoned(s: string): Temporal.ZonedDateTime {
    return Temporal.ZonedDateTime.from(s)
}

export function dateToDateTimeZoned(date: Date): Temporal.ZonedDateTime {
    return Temporal.ZonedDateTime.from({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds(),
        timeZone: Temporal.Now.timeZoneId(),
    })
}

export function dateTimeZonedToDate(date: Temporal.ZonedDateTime): Date {
    return new Date(date.epochMilliseconds)
}

// #region Utils
