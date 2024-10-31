export const snap = (val: number, snapsize: number): number => {
   return Math.round(val / snapsize) * snapsize
}
