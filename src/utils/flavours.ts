/** usefull to catch most *units* type errors */
export type Tagged<O, Tab> = O & { __tag?: Tab }

/** same as Tagged, but even scriter */
export type Branded<O, Brand> = O & { __brand: Brand }
