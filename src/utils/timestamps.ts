export const getYYYYMMDD_HHMM_SS = (): string => {
    const date = new Date()
    return (
        date.getFullYear() +
        pad2(date.getMonth() + 1) +
        pad2(date.getDate()) +
        '_' +
        pad2(date.getHours()) +
        pad2(date.getMinutes()) +
        '_' +
        pad2(date.getSeconds())
    )
}

function pad2(n: number) {
    // always returns a string
    return (n < 10 ? '0' : '') + n
}
