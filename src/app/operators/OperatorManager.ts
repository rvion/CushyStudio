import { RefObject, useEffect } from 'react'
import { STATE } from 'src/state/state'

type Ctx = STATE

export enum OperatorReturnTypeDefinition {
    UNKNOWN = 'UNKNOWN',
    CANCELLED = 'CANCELLED',
    FINISHED = 'FINISHED',
    /** Modals and Invoke should return this if they want to block inputs. */
    MODAL = 'MODAL',
    /** Modals and Invoke should return this if they do not want to block inputs. */
    PASSTHROUGH = 'PASSTHROUGH',
}

export type OperatorReturnType = keyof typeof OperatorReturnTypeDefinition

/** Starting values/variables for an operator. */
// export enum OperatorProperties {}

/** Persistent data for a running operator */
// export enum OperatorData {}

export type Operator = {
    id: string
    label?: string
    description?: string
    /** Used when called from a shortcut, it passes the event to the operator */
    invoke?: (self: Operator, ctx: Ctx, ev: Event) => OperatorReturnType
    /** When a modal is on stack it will be passed an event */
    modal?: (self: Operator, ctx: Ctx, ev: Event) => OperatorReturnType
    /** Whether or not to run when the shortcut conditions are met */
    poll?: (self: Operator, ctx: Ctx, ev: Event) => OperatorReturnType
    /** Used for when called from a button click, it does not need an event and should be able to run without one.
     *  Passing "MODAL" or "PASSTHROUGH" here does nothing.
     */
    exec?: (self: Operator, ctx: Ctx) => OperatorReturnType
    properties?: Object
    data?: Object
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

    unregister = (op: Operator) => {
        if (!(op.id in this.operators)) {
            console.warn(`[🧬] Attempt to unregister operator that doesn't exist, "${op.id}"`)
            return
        }
        delete this.operators[op.id]
    }

    /** Push an operator on to the modal stack */
    pushModal = (op: Operator) => {
        this.stack.push(op)
    }

    /** Runs through the stack of modals, starting from the most recently pushed. */
    runModals = (ctx: Ctx, event: Event) => {
        document.getElementById('input-blocker')?.classList.remove('input-blocker-active')
        const stack = this.stack.toReversed()

        for (let op of stack) {
            if (!op.modal) {
                console.warn(`[🧬] Operator "${op.id}" is in modal stack while not having a modal. This should not happen.`)
                continue
            }
            const returnType = op.modal(op, ctx, event)
            switch (returnType) {
                case 'CANCELLED':
                    /* TODO: Some sort of undo logic/cleanup function should be added to reset state back to before when we started? */
                    this.stack.pop()
                    this.blockInput(event)
                    break
                case 'FINISHED':
                    this.stack.pop()
                    this.blockInput(event)
                    break
                case 'MODAL':
                    this.blockInput(event)
                    break
                case 'PASSTHROUGH':
                    break
                default:
                    break
            }
        }
    }

    blockInput = (event: Event) => {
        console.log('[🧬] - Blocking input!!!')
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()

        document.getElementById('input-blocker')?.classList.add('input-blocker-active')
    }

    /** Attempt to run an operator with an event */
    invoke = (id: string, ctx: Ctx, event: Event): OperatorReturnType => {
        if (!(id in this.operators)) {
            console.warn(`[🧬] Tried to invoke operator that doesn't exist: "${id}"`)
            return 'CANCELLED'
        }

        const op = this.operators[id]
        if (op.invoke) {
            const returnType = op.invoke(op, ctx, event)
            if (returnType in ['CANCELLED', 'FINISHED', 'MODAL']) {
                this.blockInput(event)
            }
            return returnType
        }
        if (op.exec) {
            return op.exec(op, ctx)
        }

        console.warn(`[🧬] Operator "${id}" has no invoke or exec function, how did this even happen???`)
        return 'CANCELLED'
    }

    exec = (id: string, ctx: Ctx): OperatorReturnType => {
        if (!(id in this.operators)) {
            console.warn(`[🧬] Tried to invoke operator that doesn't exist: "${id}"`)
            return 'CANCELLED'
        }

        const op = this.operators[id]
        console.log(`[🧬] exec | op: `, op)
        if (op && op.exec) {
            console.log(`[🧬] exec | op.exec:`, op.exec)
            try {
                return op.exec(op, ctx)
            } catch (e) {
                console.error('[🧬]', e)
            }
            return 'CANCELLED'
        }

        console.warn(`Operator ${op.id} has no exec function. Skipping...`)
        return 'CANCELLED'
    }

    registerTestOperator = () => {
        console.log('[🧬] - Registering test operator!')
        this.register(TEST_OT_test)
    }

    unregisterTestOperator = () => {
        this.unregister(TEST_OT_test)
    }

    useEffect = (st: STATE, appRef: RefObject<HTMLDivElement>) => {
        document.getElementById('input-blocker')?.classList.remove('input-blocker-active')

        function onEvent(event: Event) {
            st.operators.runModals(st, event)

            /* Keymapping/shortcut system should replace this */
            if (!event.defaultPrevented && event instanceof KeyboardEvent) {
                if (event.key == 's') {
                    st.operators.invoke('TEST_OT_test', st, event)
                }
            }
        }
        useEffect(() => {
            window.addEventListener('click', onEvent)
            window.addEventListener('dblclick', onEvent)
            window.addEventListener('mousedown', onEvent)
            window.addEventListener('mouseup', onEvent)
            window.addEventListener('mouseenter', onEvent)
            window.addEventListener('mouseleave', onEvent)
            window.addEventListener('mousemove', onEvent)
            window.addEventListener('keydown', onEvent)
            window.addEventListener('keyup', onEvent)
            window.addEventListener('focus', onEvent)
            window.addEventListener('blur', onEvent)
            window.addEventListener('input', onEvent)
            window.addEventListener('change', onEvent)
            window.addEventListener('scroll', onEvent)
            window.addEventListener('resize', onEvent)
            return () => {
                window.removeEventListener('click', onEvent)
                window.removeEventListener('dblclick', onEvent)
                window.removeEventListener('mousedown', onEvent)
                window.removeEventListener('mouseup', onEvent)
                window.removeEventListener('mouseenter', onEvent)
                window.removeEventListener('mouseleave', onEvent)
                window.removeEventListener('mousemove', onEvent)
                window.removeEventListener('keydown', onEvent)
                window.removeEventListener('keyup', onEvent)
                window.removeEventListener('focus', onEvent)
                window.removeEventListener('blur', onEvent)
                window.removeEventListener('input', onEvent)
                window.removeEventListener('change', onEvent)
                window.removeEventListener('scroll', onEvent)
                window.removeEventListener('resize', onEvent)
            }
        }, [appRef.current, st])
    }
}

/* TODO: Need to make sure data persistence works and do an example. */
const TEST_OT_test = {
    id: 'TEST_OT_test',
    label: 'Test',
    description: 'This is a test operator',
    invoke: (self: Operator, ctx: Ctx, event: Event) => {
        console.log('[🧬] HELLO INVOKE')
        ctx.operators.pushModal(self)
        return 'MODAL'
    },
    modal: (self: Operator, ctx: Ctx, event: Event) => {
        if (event instanceof KeyboardEvent) {
            console.log('[🧬] - Hello MODAL: ', event.key)
            if (event.key == 'Escape') {
                console.log('[🧬] - Cancelling Modal!!')
                return 'CANCELLED'
            }
        }

        if (event instanceof MouseEvent) {
            // return 'PASSTHROUGH'
        }
        return 'MODAL'
    },
    exec: (self: Operator, ctx: Ctx) => {
        console.log('[🧬] HELLO EXE')
        return 'FINISHED'
    },
} as Operator
