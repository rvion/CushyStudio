export function formatDateForInput(date: Maybe<Date>): string {
    if (date == null || isNaN(date.getTime())) return ''
    return date.toISOString().split('.')[0]!
}
