import { BoundCommandSym } from './_isBoundCommand'
import { RET } from './RET'

// ------------------------------------------------------------------------------------------
// COMMAND MANAGER Centralize every single command
class CommandManager {
    operators: Command[] = []
    registerCommand = (op: Command) => this.operators.push(op)
    getCommandById = (id: string) => this.operators.find((op) => op.id === id)
}
const commandManager = new CommandManager()

// ------------------------------------------------------------------------------------------
// COMMAND = a function with a name, a description, and a condition whether it can be started or not
type Command_<Ctx = any, Props = any> = {
    label: string
    id: string // ❓ make optional ; autogenerated ?
    description?: string
    $property: Props
    when?: (p: Props /* event: Event */) => Ctx | RET.UNMATCHED
    run: (p: Props, t: Ctx) => RET | Promise<RET>
    // menu?: (p: Props, t: Ctx) => MenuEntry[]
    /** menuEntries */
}

// ------------------------------------------------------------------------------------------
interface Command<Ctx = any, Props = any> extends Command_<Ctx, Props> {}
class Command<Ctx = any, Props = any> {
    type: 'command' = 'command'
    constructor(private _p: Command_<Ctx, Props>) {
        Object.assign(this, _p)
    }

    /**
     * method to programmatically call a command,
     * using when to both extract context and check if command can run
     * */
    call = (p: Props) => {
        console.warn(`[CMD] ☣️ TRYING TO RUN... ${this.label} with props ${JSON.stringify(p)}`)
        const context = this._p.when?.(p)
        if (context === RET.UNMATCHED) {
            console.warn(`[CMD] 🔴 FAILED TO RUN`)
            return RET.UNMATCHED
        }
        const res = this._p.run?.(p, context!)
        return res
    }

    bind = (
        //
        props: Props,
        ui?: BoundCommandOpts,
    ): BoundCommand<Ctx, Props> => {
        return new BoundCommand(this, props, ui)
    }
}
// ------------------------------------------------------------------------------------------
export type Check<T> = T | RET.UNMATCHED

// small helper to create commands and register them globally
export const command = <T, P>(t: Omit<Command_<T, P>, 'type' | '$property'>): Command<T, P> => {
    const cmd = new Command(t as any)
    commandManager.registerCommand(cmd)
    return cmd
}

// ------------------------------------------------------------------------------------------
// A bound command; ready to be executed
export type BoundCommandOpts = { label?: string }
export class BoundCommand<Ctx = any, Props = any> {
    $SYM = BoundCommandSym

    get label() {
        return this.ui?.label ?? this.command.label
    }
    constructor(
        //
        public command: Command<Ctx, Props>,
        public props: Props,
        public ui?: BoundCommandOpts,
    ) {}
}