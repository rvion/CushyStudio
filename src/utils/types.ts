/** usefull to catch most *units* type errors */

export type Tagged<O, Tag> = O & { __tag?: Tag }
/** same as Tagged, but even scriter */

export type Branded<O, Brand> = O & { __brand: Brand }

export type Maybe<T> = T | null | undefined
