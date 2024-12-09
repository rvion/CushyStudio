import type { DateFormat } from './i18n'

import { exhaust } from '../utils/exhaust'

type ParsedDate = { day: number; month: number; year: number; hour?: number; minute?: number }

// #region FR

export function formatDateTimeFR(date: Date, mode: DateFormat): string {
    if (mode === 'date') {
        return date.toLocaleString('fr-FR', {
            dateStyle: 'short',
        })
    }

    if (mode === 'datetime') {
        return date.toLocaleString('fr-FR', {
            timeStyle: 'short',
            dateStyle: 'short',
        })
    }

    exhaust(mode)
}

export function parseDateTimeFR(s: string): Date {
    const parsed = parseDateFR(s)

    if (!parsed) throw new Error('Invalid date')

    const { day, month, year, hour, minute } = parsed

    const date = new Date(year, month - 1, day, hour ?? 0, minute ?? 0)

    if (isNaN(date.getTime())) throw new Error('Invalid date')

    return date
}

function parseDateFR(s: string): ParsedDate {
    const matches = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+(\d{1,2})[h:](\d{1,2})?)?$/)
    if (!matches) throw new Error('Invalid date')
    const [, dayStr, monthStr, yearStr, hourStr, minuteStr] = matches

    if (dayStr == null || monthStr == null || yearStr == null) throw new Error('Invalid date')

    const year = yearStr.length === 2 ? 2000 + parseInt(yearStr) : parseInt(yearStr)
    const month = parseInt(monthStr)
    const day = parseInt(dayStr)
    const hour = hourStr != null ? parseInt(hourStr) : undefined
    const minute = minuteStr != null ? parseInt(minuteStr) : undefined

    if (isNaN(year) || isNaN(month) || isNaN(day) || (hour != null && isNaN(hour)) || (minute != null && isNaN(minute)))
        throw new Error('Invalid date')

    if (day > 31 || month > 12 || (hour != null && hour > 23) || (minute != null && minute > 59)) throw new Error('Invalid date')

    return { day: day, month: month, year: year, hour: hour, minute: minute }
}

// #region EN-US

export function formatDateTimeEN_US(date: Date, mode: DateFormat): string {
    if (mode === 'date') {
        return date.toLocaleString('en-US', {
            dateStyle: 'short',
        })
    }

    if (mode === 'datetime') {
        return date.toLocaleString('en-US', {
            timeStyle: 'short',
            dateStyle: 'short',
        })
    }

    exhaust(mode)
}

export function parseDateTimeEN_US(s: string): Date {
    const parsed = parseDateEN_US(s)

    if (!parsed) throw new Error('Invalid date')

    const { day, month, year, hour, minute } = parsed

    const date = new Date(year, month - 1, day, hour ?? 0, minute ?? 0)

    if (isNaN(date.getTime())) throw new Error('Invalid date')

    return date
}

function parseDateEN_US(s: string): ParsedDate {
    const sanitized = s.trim().replace(/[\s,;]$/g, '')
    const matches = sanitized.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:[\s,;]+(\d{1,2})(?:[h:](\d{1,2}))?)?(?:[\s]*((?:am)|(?:pm)))?$/i,
    )
    if (!matches) throw new Error('Invalid date')
    const [, monthStr, dayStr, yearStr, hourStr, minuteStr, amPm] = matches

    if (dayStr == null || monthStr == null || yearStr == null) throw new Error('Invalid date')

    const year = yearStr.length === 2 ? 2000 + parseInt(yearStr) : parseInt(yearStr)
    const month = parseInt(monthStr)
    const day = parseInt(dayStr)
    let hour = hourStr != null ? parseInt(hourStr) : undefined
    if (amPm != null && amPm.toLowerCase() === 'pm' && hour != null && hour < 12) {
        hour += 12
    }
    const minute = minuteStr != null ? parseInt(minuteStr) : undefined

    if (isNaN(year) || isNaN(month) || isNaN(day) || (hour != null && isNaN(hour)) || (minute != null && isNaN(minute)))
        throw new Error('Invalid date')

    if (day > 31 || month > 12 || (hour != null && hour > 23) || (minute != null && minute > 59)) throw new Error('Invalid date')

    return { day: day, month: month, year: year, hour: hour, minute: minute }
}
