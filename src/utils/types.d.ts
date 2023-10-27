/** usefull to catch most *units* type errors */

declare type Tagged<O, Tag> = O & { __tag?: Tag }
/** same as Tagged, but even scriter */

declare type Branded<O, Brand extends { [key: string]: true }> = O & Brand

declare type Maybe<T> = T | null | undefined

declare type Timestamp = Tagged<number, 'Timestamp'>
