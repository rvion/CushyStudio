import type { Field } from './Field'
import type { Repository } from './Repository'

// prettier-ignore
export type FieldTouchMode =
    | 'value'
    | 'serial'
    // | 'none'
    | 'create'
    | 'auto'

// prettier-ignore
export type FieldTouchReal =
    | 'value'
    | 'serial'
    | 'create'

export type TransactionMode = 'WITH_EFFECT' | 'NO_EFFECT'

export class Transaction {
    constructor(
        //
        public repo: Repository,
        // 🔴 Transaction mode is not used yet
        // public mode: TransactionMode,
    ) {}

    /** fields that have been created during the transaction */
    bump: {
        [key in FieldTouchReal]: number
    } = {
        create: 0,
        serial: 0,
        value: 0,
    }

    touchedFields = new Map<Field, FieldTouchReal>()
    track(field: Field, mode: FieldTouchReal): void {
        const prev = this.touchedFields.get(field)

        // if this is true, we should have already propagated
        // upwards with all the correct values...
        if (prev === mode) return

        if (prev == null) {
            this.touchedFields.set(field, mode)
            this.bump[mode]++
        } else if (prev === 'serial' && mode === 'value') {
            this.bump.serial--
            this.bump.value++
            this.touchedFields.set(field, 'value')
        } else if (prev === 'value' && mode === 'create') {
            this.bump.value--
            this.bump.create++
            this.touchedFields.set(field, 'create')
        }

        // propagate to parents
        if (field.parent) {
            const parentMode = mode === 'create' ? 'value' : mode
            this.track(field.parent, parentMode)
        }
    }

    commit(): void {
        // bump transaction
        this.repo.transactionCount++
        this.repo.totalValueTouched += this.bump.value
        this.repo.totalSerialTouched += this.bump.serial
        this.repo.totalCreations += this.bump.create

        // compute all nodes from leaves that need to call effects
        // call them in order, non recursively.
        const entries = Array.from(this.touchedFields.entries())
            .map(([field, mode]) => ({ field, mode, depth: field.trueDepth }))
            .sort((a, b) => b.depth - a.depth)

        for (const { field, mode } of entries) {
            if (mode !== 'create') continue
            // console.log(`>> ${field.path}.onValue`)
            this.repo.debugLog(`🟢 ${`onInit`.padEnd(10)} ${field.path}`)
            field.config.onInit?.(field)
        }

        for (const { field, mode } of entries) {
            if (mode !== 'value') continue
            // console.log(`${field.path}.onValue`)
            this.repo.debugLog(`🔶 ${`onValue`.padEnd(10)} ${field.path}`)
            field.applyValueUpdateEffects()
        }

        for (const { mode, field } of entries) {
            if (mode === 'serial' || mode === 'value') {
                // console.log(`${field.path}.onSerial`)
                this.repo.debugLog(`❌ ${`onSerial`.padEnd(10)} ${field.path}`)
                field.applySerialUpdateEffects()
            }
        }

        for (const { field, mode } of entries) {
            if (mode !== 'value') continue
            // console.log(`${field.path}.publish`)
            this.repo.debugLog(`💙 ${`publish`.padEnd(10)} ${field.path}`)
            field.publishValue()
        }
    }
}
