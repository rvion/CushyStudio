import type { IWidget } from '../controls/IWidget'
import type { ReactNode } from 'react'

import { CushyFormManager } from '../controls/FormBuilder'
import { MediaImageL } from '../models/MediaImage'
import { RET } from './RET'

// --------------------------------------------------------------------------------------------------------------
// ACTIVITY = global app state machine state you can be in;
// consume all events, and react to them
// may let some pass though; or not
interface Activity {
    /** if given, the activity is bound the the given ID */
    bound?: DomId | null
    start: () => void
    onEvent: (event: Event) => RET | null
    stop: () => void
}

class ActivityManager {
    stack: Activity[] = []
    push = (activity: Activity) => {
        this.stack.push(activity)
        activity.start()
        return RET.DONE
    }
    pop = () => {
        const activity = this.stack.pop()
        activity?.stop()
    }
    current = () => this.stack[this.stack.length - 1]
}
const activityManger = new ActivityManager()

// MENU ACTIVITY --------------------------------------------------------------------------------------------------------------
type DomId = string

// ACTIVITY STACK
type MenuKB = { key: string; command: CommandWithProps }
type MenuEntry = IWidget | CommandWithProps | ReactNode

class Menu<Props> {
    open(props: Props): RET | Promise<RET> {
        const instance = new MenuInstance(this, props)
        return activityManger.push(instance)
    }
    constructor(public options: (props: Props) => MenuEntry[]) {}
}

class MenuInstance<Props> implements Activity {
    start = (): void => {}
    onEvent = (event: Event): RET | null => {
        event.stopImmediatePropagation()
        event.stopPropagation()
        event.preventDefault()
        return null
    }
    stop = (): void => {}
    constructor(
        //
        public menu: Menu<Props>,
        public props: Props,
    ) {}

    get options(): MenuEntry[] {
        return this.menu.options(this.props)
    }

    get keybindings(): MenuKB[] {
        const allocatedKeys = new Set<string>()
        const findSuitableKeys = (x: CommandWithProps): Maybe<string> => {
            for (const char of [...x.command.label]) {
                const key = char.toLowerCase()
                if (!allocatedKeys.has(key)) {
                    allocatedKeys.add(key)
                    return key
                }
            }
        }
        const out: MenuKB[] = []
        for (const entry of this.options) {
            if (isCommandWithProps(entry)) {
                const key = findSuitableKeys(entry)
                if (key == null) continue
                out.push({ command: entry, key })
            }
            continue
        }
        return out
    }
}

const menu = <P>(entries: (props: P) => MenuEntry[]): Menu<P> => new Menu(entries)

// --------------------------------------------------------------------------------------------------------------
// COMMAND MANAGER Centralize every single command
class CommandManager {
    operators: Command[] = []

    registerCommand(op: Command) {
        this.operators.push(op)
    }

    getCommandById(id: string) {
        return this.operators.find((op) => op.id === id)
    }
}
const commandManager = new CommandManager()

export class CommandWithProps<Ctx = any, Props = any> {
    constructor(
        //
        public command: Command<Ctx, Props>,
        public props: Props,
    ) {}
}
export const isCommandWithProps = (x: unknown): x is CommandWithProps<any, any> => x instanceof CommandWithProps

// COMMAND = a function with a name, a description, and a condition whether it can be started or not
type Command_<Ctx = any, Props = any> = {
    id: string
    label: string
    description: string
    $property: Props
    when: (p: Props, event: Event) => Ctx | RET
    run: (t: Ctx, p: Props) => RET | Promise<RET>
}
interface Command<T = any, P = any> extends Command_<T, P> {}
class Command<T = any, P = any> {
    type: 'command' = 'command'
    constructor(private _p: Command_) {
        Object.assign(this, _p)
    }
    withProps = (props: P): CommandWithProps<T, P> => new CommandWithProps(this, props)
}
const command = <T, P>(t: Omit<Command_<T, P>, 'type' | '$property'>): Command<T, P> => {
    const cmd = new Command(t as any)
    commandManager.registerCommand(cmd)
    return cmd
}

export type Check<T> = T | RET.UNMATCHED
// ========================================================================================================================
// ========================================================================================================================
// ========================================================================================================================
// ========================================================================================================================
// ========================================================================================================================
// ========================================================================================================================
// ========================================================================================================================
// ========================================================================================================================
// ========================================================================================================================
// ========================================================================================================================
// ========================================================================================================================

// ---------------------------------------------------------------------
// example 1: when the mouse is over an image in the gallery
const cmd_copyGalleryHoveredImage = command({
    id: 'gallery.copyHoveredImage',
    label: 'Copy Hovered Image in Gallery',
    description: `Copy the image under the mouse in the gallery to the clipboard (as png)`,
    when: (): Check<MediaImageL> => {
        if (cushy.layout.currentTabIs('Gallery') && cushy.hovered instanceof MediaImageL) return cushy.hovered
        return RET.UNMATCHED
    },
    run: async (image: MediaImageL, p: { format: AvailableImageCopyFormats }) => {
        return await image.copyToClipboard(p)
    },
})

// ---------------------------------------------------------------------
// example 2: image actions:
type AvailableImageCopyFormats = 'PNG' | 'JPG' | 'WEBP'
type CopyImageParams = Partial<{ image: MediaImageL; format: AvailableImageCopyFormats }>
const cmd_copyImage = command({
    id: 'gallery.copyImage',
    label: 'Copy Image in Gallery',
    description: `Copy the image under the mouse in the gallery to the clipboard (as png)`,
    when: (p: CopyImageParams) => p.image ?? RET.UNMATCHED,
    run: async (image: MediaImageL, p: CopyImageParams) =>
        await image.copyToClipboard({ format: p.format ?? 'PNG', quality: form_foo.fields.quality.value }),
})

// simply open a menu to show both options
const cmd_copyImageAs = command({
    id: 'gallery.copyImageAs',
    label: 'Copy in Gallery',
    description: `Copy the image under the mouse in the gallery to the clipboard (as png)`,
    when: (p: CopyImageParams) => (p ? (p instanceof MediaImageL ? p : RET.UNMATCHED) : RET.UNMATCHED),
    run: (image: MediaImageL) => menu_copyImageAs.open(image),
})

const form_foo = CushyFormManager.form((ui) => ({
    quality: ui.int({ min: 0, softMin: 0.3, max: 1 }),
}))

// ---------------------------------------------------------------------
const menu_imageActions = menu((image: MediaImageL) => [
    command(cmd_copyImage).withProps({ image }),
    command(cmd_copyImageAs).withProps({ image }),
])

const menu_copyImageAs: Menu<MediaImageL> = menu((image: MediaImageL) => [
    cmd_copyImage.withProps({ image, format: 'PNG' }),
    cmd_copyImage.withProps({ image, format: 'WEBP' }),
    cmd_copyImage.withProps({ image, format: 'JPG' }),
    form_foo.fields.quality,
])

// TODO: example of custom contxt and computed and stuff though this with class

// --------------------------------------------------------------------------------------------------------------
// const Stack = StackItem[]
// const st = 0 as any
// const op_startMove = operator(st.in3dView && st.itemSelected, startActivity(sk_moveObject, T))
// const kb_startmove = trigger(op_startMove, 'G')
// const sk_moveObject= activity()

// menu():MenuActivity

// ------------------------------------------------------------------------------------------------------------
// const copyImageOp = operator({
//     id: 'GALLERY_OT_copy_hovered',
//     label: 'Copy Hovered Image in Gallery',
//     description: `Copy the image under the mouse in the gallery to the clipboard (as png)`,
//     preCheck: (/* self: Operator, */ ctx: STATE, event: Event) => {
//         if (ctx.hovered instanceof MediaImageL) return ctx.hovered
//         return 'UNMATCHED'
//     },
//     invoke: (/* self: Operator, */ ctx: STATE, image: MediaImageL) => {
//         image.copyToClipboard()
//         return 'FINISHED'
//     },
// })

// KeyBinding -----------------------------------------------------------------------------------------------------
// KeyBinding -----------------------------------------------------------------------------------------------------
// const keybinding = kb({
//     id: 'GALLERY_OT_copy_hovered',
//     when: () => {
//         if (cushy.mouse.isOver('Gallery') && cushy.hovered instanceof MediaImageL) return cushy.hovered
//         return 'UNMATCHED'
//     },
//     defaultKeyMap: 'Ctrl+C',
//     action: copyImageOp,
// })
