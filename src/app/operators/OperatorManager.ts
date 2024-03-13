import { STATE } from 'src/state/state'
import { useSt } from 'src/state/stateContext'

type Ctx = STATE

export enum OperatorReturnType {
    UNKNOWN = -1,
    CANCELLED = 0,
    FINISHED = 1,
    /** Modals and Invoke should return this if they want to block inputs. */
    MODAL = 2,
    /** Modals and Invoke should return this if they do not want to block inputs. */
    PASSTHROUGH = 3,
}

/** Starting values/variables for an operator. */
// export enum OperatorProperties {}

/** Persistent data for a running operator */
// export enum OperatorData {}

export type Operator = {
    id: string
    label?: string
    description?: string
    /** Used when called from a shortcut, it passes the event to the operator */
    invoke?: (ctx: Ctx, ev: Event) => OperatorReturnType
    /** When a modal is on stack it will be passed an event */
    modal?: (ctx: Ctx, ev: Event) => OperatorReturnType
    poll?: (ctx: Ctx, ev: Event) => OperatorReturnType
    /** Used for when called from a button click, it does not need an event and should be able to run without one.
     *  Passing "MODAL" or "PASSTHROUGH" here does nothing.
     */
    exec?: (ctx: Ctx) => OperatorReturnType
    properties?: any
    data?: any
}

export class OperatorManager {
    constructor() {
        this.registerTestOperator()
    }
    readonly operators: { [id: string]: Operator } = {}
    /* Stack of modal operators currently running */
    stack: Operator[] = []

    register = (op: Operator) => {
        if (op.id in this.operators) {
            console.warn(`[🧬] Operator with id "${op.id}" already exists. Operator will not be re-registered.`)
            return
        }

        if (!op.invoke && !op.exec) {
            console.warn(`[🧬] Failed to register operator "${op.id}" invoke and exec are undefined.`)
            return
        }

        this.operators[op.id] = op
    }

    /** Attempt to run an operator with an event */
    invoke = (id: string, event: Event) => {
        if (!(id in this.operators)) {
            console.warn(`[🧬] Tried to invoke operator that doesn't exist: "${id}"`)
            return
        }

        const op = this.operators[id]
        if (op.invoke) {
            const st = useSt()
            const returnType = op.invoke(st, event)
            if ([OperatorReturnType.CANCELLED, OperatorReturnType.FINISHED, OperatorReturnType.MODAL]) {
                event.preventDefault()
                event.stopPropagation()
            }
        }
    }

    exec = (id: string, ctx: Ctx) => {
        if (!(id in this.operators)) {
            console.warn(`[🧬] Tried to invoke operator that doesn't exist: "${id}"`)
            return
        }

        const op = this.operators[id]
        console.log(`[🧬] exec | op: `, op)
        if (op && op.exec) {
            console.log(`[🧬] exec | op.exec:`, op.exec)
            try {
                op.exec(ctx)
            } catch (e) {
                console.error('[🧬]', e)
            }
            return
        }
    }

    /** Sends events to a running modal if there are any. */
    private onEvent = (event: Event) => {
        console.log(event)
        const st = useSt()

        for (let op of this.stack) {
            if (!op.modal) {
                console.warn(`Operator ${op.id} has no modal function but is on modal stack. Skipping...`)
                continue
            }
            const returnType = op.modal(st, event)
        }
    }

    private registerEventListeners = () => {}

    registerTestOperator = () => {
        console.log('[🧬] - Registering test operator!')
        this.register({
            id: 'TEST_OT_test',
            label: 'Test',
            description: 'This is a test operator',
            exec: (ctx: Ctx) => {
                console.log('[🧬] HELLO WORLD')
                return OperatorReturnType.FINISHED
            },
        })
    }
}
