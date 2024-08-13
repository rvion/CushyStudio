export function toCssSizeValue(x: number | string): string {
    return typeof x == 'number' ? `${Math.round(x)}px` : x
}
