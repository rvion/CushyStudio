import type { Field } from './Field'
import type { Repository } from './Repository'

// prettier-ignore
export type FieldTouchMode =
    | 'value'
    | 'serial'
    | 'none'
    | 'create'
    | 'auto'

export type TransactionMode = 'WITH_EFFECT' | 'NO_EFFECT'

export class Transaction {
    constructor(
        //
        public repo: Repository,
        public mode: TransactionMode,
    ) {}

    /** fields that have been created during the transaction */
    fieldCreated: Set<Field<any>> = new Set()

    /**
     * fields that were previously existing that had their serial change
     * in a value-altering way
     */
    valueTouched: Set<Field<any>> = new Set()

    /**
     * fields that were previously existing that had their serial change
     * in a NON-value-altering way
     */
    serialTouched: Set<Field<any>> = new Set()

    /**
     *
     */
    track(field: Field, mode: FieldTouchMode): void {
        if (mode === 'value') this.valueTouched.add(field)
        else if (mode === 'serial') this.serialTouched.add(field)
        else if (mode === 'create') this.fieldCreated.add(field)
        else if (mode === 'none') return
        else throw new Error(`unknown mode: ${mode}`)
    }

    commit(): void {
        this.repo.transactionCount++
        this.repo.totalValueTouched += this.valueTouched.size
        this.repo.totalSerialTouched += this.serialTouched.size
        this.repo.totalCreations += this.fieldCreated.size

        // compute all nodes from leaves that need to call effects
        // call them in order, non recursively.

        for (const field of this.valueTouched) {
            this.repo.debugLog(`[🟢] ${field.path} touched`)
            field.applyValueUpdateEffects()
        }
        for (const field of this.serialTouched) {
            field.applySerialUpdateEffects()
        }
    }
}
