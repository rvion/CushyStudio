import type { NumberFormat } from './i18n'

import { exhaust } from '../utils/exhaust'

// #region FR
const frFormatter = new Intl.NumberFormat('fr-FR')
const frFormatterAmount = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})
const frFormatterInt = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})

export function parseNumberFR(val: string, format: NumberFormat): number {
    if (format === 'amount' || format === 'float') return parseFloat(val.replace(/\s/g, '').replace(/,/g, '.'))

    if (format === 'int') return parseInt(val.replace(/\s/g, ''), 10)

    exhaust(format)
}

export function formatNumberFR(val: number, format: NumberFormat): string {
    if (format === 'amount') return frFormatterAmount.format(val)
    if (format === 'float') return frFormatter.format(val)
    if (format === 'int') return frFormatterInt.format(val)
    exhaust(format)
}

// #region EN-US
const enFormatter = new Intl.NumberFormat('en-US')
const enFormatterAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})
const enFormatterInt = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})

export function parseNumberEN(val: string, format: NumberFormat): number {
    if (format === 'amount' || format === 'float') return parseFloat(val.replace(/[\s,]/g, ''))
    if (format === 'int') return parseInt(val.replace(/[\s,]/g, ''), 10)
    exhaust(format)
}

export function formatNumberEN(val: number, format: NumberFormat): string {
    if (format === 'amount') return enFormatterAmount.format(val)
    if (format === 'float') return enFormatter.format(val)
    if (format === 'int') return enFormatterInt.format(val)
    exhaust(format)
}
