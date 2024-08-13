export const deepCopyNaive = <T>(x: T): T => JSON.parse(JSON.stringify(x))
