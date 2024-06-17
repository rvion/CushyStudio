export function rgb1to256(value: number): number {
    return Math.round(parseFloat(value.toFixed(4)) * 255)
}
