import { format } from 'src/utils/date-fns-mini'

export function formatDateForInput(date: Maybe<Date>): string {
    if (date == null || isNaN(date.getTime())) return ''
    return format(date, `yyyy-MM-dd'T'HH:mm`)
}
