export const exhaust = (x: never) => x
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
export const deepCopyNaive = <T>(x: T): T => JSON.parse(JSON.stringify(x))
