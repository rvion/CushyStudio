export const exhaust = (x: never) => x

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function jsEscapeStr(x: any) {
    if (typeof x === 'string') return JSON.stringify(x)
    if (typeof x === 'number') return x.toString()
    if (typeof x === 'boolean') return x.toString()
    return x
}

/** usefull to catch most *units* type errors */
export type Tagged<O, Tab> = O & { __tag?: Tab }

/** same as Tagged, but even scriter */
export type Branded<O, Brand> = O & { __brand: Brand }
