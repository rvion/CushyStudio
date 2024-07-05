import type { Field } from './Field'
import type { Repository } from './Repository'

export type TouchMode = 'value' | 'serial' | 'none'

export class Transaction {
    private valueTouched: Set<Field<any>> = new Set()
    private serialTouched: Set<Field<any>> = new Set()

    constructor(public repo: Repository) {}

    track(field: Field, mode: TouchMode) {
        if (mode === 'value') this.valueTouched.add(field)
        else if (mode === 'serial') this.serialTouched.add(field)
        else if (mode === 'none') return
        else throw new Error(`unknown mode: ${mode}`)
    }

    commit() {
        for (const field of this.valueTouched) {
            field.applyValueUpdateEffects()
        }
        for (const field of this.serialTouched) {
            field.applyValueUpdateEffects()
        }
    }
}
