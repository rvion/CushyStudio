import type { IconName } from '../icons/icons'

import { Button } from '../button/Button'
import { BoundCommandSym } from '../introspect/_isBoundCommand'
import { CommandSym } from '../introspect/_isCommand'
import { Trigger } from '../trigger/Trigger'
import { commandManager, type CushyShortcut } from './CommandManager'

// ------------------------------------------------------------------------------------------
// COMMAND = a function with a name, a description, and a condition whether it can be started or not
type Command_<Ctx = any> = {
    icon?: IconName
    combos?: CushyShortcut | CushyShortcut[]
    label: string
    id: string // ❓ make optional ; autogenerated ?
    description?: string
    ctx: CommandContext<Ctx>
    action: (t: Ctx) => Trigger | Promise<Trigger>
    /** placeholder; unused for now */
    undo?: (t: Ctx) => Trigger | Promise<Trigger>
    // keymap
    validInInput?: boolean
    continueAfterSuccess?: boolean
    // menu?: (p: Props, t: Ctx) => MenuEntry[]
    /** menuEntries */
}

// ------------------------------------------------------------------------------------------
export interface Command<Ctx = any> extends Command_<Ctx> {}
export class Command<Ctx = any> {
    $SYM = CommandSym

    get firstCombo(): CushyShortcut | undefined {
        if (this.combos == null) return undefined
        if (Array.isArray(this.combos)) {
            if (this.combos.length === 0) return undefined
            else return this.combos[0]
        } else return this.combos
    }

    constructor(public conf: Command_<Ctx>) {
        Object.assign(this, conf)
    }

    /** bind a command to a static context, bypassing its context provider */
    bind(ctx: Ctx): BoundCommand<Ctx> {
        return new BoundCommand(this, ctx)
    }

    /**
     * method to programmatically call a command,
     * using when to both extract context and check if command can run
     * */
    execute = () => {
        console.info(`[CMD] ☣️ TRYING TO RUN... ${this.label}`)
        const context = this.conf.ctx.check()
        if (context === Trigger.UNMATCHED) {
            console.warn(`[CMD] 🔴 FAILED TO RUN`)
            return Trigger.UNMATCHED
        }
        const res = this.conf.action?.(context!)
        return res
    }

    NavBarBtnUI = (p: { label?: string }) => {
        return (
            <Button border={false} onClick={() => this.execute()}>
                {p.label ?? this.label}
            </Button>
        )
    }
}

// ------------------------------------------------------------------------------------------
export class CommandContext<Ctx = any> {
    constructor(
        /** display name */
        public name: string,
        /** actual function code */
        public check: () => Ctx | Trigger.UNMATCHED,
    ) {}
}

// small helper to create commands and register them globally
export function command<Ctx extends any>(t: Omit<Command_<Ctx>, 'type'>): Command<Ctx> {
    const cmd = new Command(t as any)
    commandManager.registerCommand(cmd)
    return cmd
}

// ------------------------------------------------------------------------------------------
// A bound command; ready to be executed
export type BoundCommandOpts = { label?: string }
export class BoundCommand<Ctx = any> {
    $SYM = BoundCommandSym
    constructor(
        //
        private command: Command<Ctx>,
        private ctx: Ctx,
        private ui?: BoundCommandOpts,
    ) {}

    execute = () => {
        return this.command.conf.action(this.ctx)
    }

    get icon() {
        return this.command.icon
    }

    NavBarBtnUI = (p: { label?: string }) => {
        return <div onClick={() => this.execute()}>{p.label ?? this.label}</div>
    }

    get label() {
        return this.ui?.label ?? this.command.label
    }
}
