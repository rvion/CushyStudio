/**
 * a fake value that is detected at serialization
 * time to try to magically inject stuff
 * */
export type AUTO = Branded<{ ___AUTO___: true }, { AUTO: true }>

/**
 * you can use this as a placeholder anywhere in your graph
 * Cushy will try to find some node slot recently created that can be used to fill the gap
 */
export const auto = <T>(): T => auto_ as any

export const auto_: AUTO = { ___AUTO___: true } as any
