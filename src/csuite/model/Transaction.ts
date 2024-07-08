import type { Field } from './Field'
import type { Repository } from './Repository'

export type FieldTouchMode = 'value' | 'serial' | 'none' | 'create'
export type TransactionMode = 'WITH_EFFECT' | 'NO_EFFECT'

export class Transaction {
    constructor(
        //
        public repo: Repository,
        public mode: TransactionMode,
    ) {}

    /** fields that have been created during the transaction */
    private fieldCreated: Set<Field<any>> = new Set()

    /**
     * fields that were previously existing that had their serial change
     * in a value-altering way
     */
    private valueTouched: Set<Field<any>> = new Set()

    /**
     * fields that were previously existing that had their serial change
     * in a NON-value-altering way
     */
    private serialTouched: Set<Field<any>> = new Set()

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

        for (const field of this.valueTouched) {
            this.repo.debugLog(`[🟢] ${field.path} touched`)
            field.applyValueUpdateEffects()
        }
        for (const field of this.serialTouched) {
            field.applyValueUpdateEffects()
        }
    }
}
