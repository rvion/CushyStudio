export const snap = (val: number, snapsize: number) => {
    return Math.round(val / snapsize) * snapsize
}
