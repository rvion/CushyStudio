import type { CovariantFn } from '../variance/BivariantHack'

export type Klass<FIELD> = { new (...args: any[]): FIELD }

export type KlassToUse<SUPER, CUSTOM> =
    /**
     * option 1, a lambda that inject the current field
     *   + pros: simpler to write
     *   - cons: no way to retrieve the class name outside of the lambda without using some `export const ... = ` hack
     */
    | CovariantFn<[SUPER: Klass<SUPER>], Klass<CUSTOM>>
    //  | ((SUPER: Klass<FIELD>) => Klass<CUSTOM>)

    /** option 2. directly pass the child class
     *  + pros: simpler to read
     *  - cons: you have to manually import the parent class, and fill its type-level args yourself
     */
    | Klass<CUSTOM>

export function getKlass<SUPER, CUSTOM>(
    //
    SUPER: Klass<SUPER>,
    ktu: KlassToUse<any, CUSTOM>,
): Klass<CUSTOM> {
    if (ktu.prototype && ktu.prototype.constructor === ktu) {
        const fn = ktu as CovariantFn<[SUPER: Klass<SUPER>], Klass<CUSTOM>>
        return fn(SUPER) as Klass<CUSTOM>
    } else {
        return ktu as Klass<CUSTOM>
    }
}
