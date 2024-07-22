import type { Command } from '../csuite/commands/Command'
import type { IconName } from '../csuite/icons/icons'
import type { MenuEntry } from '../csuite/menu/MenuEntry'

import { ctx_global } from '../csuite/command-topic/ctx_global'
import { command } from '../csuite/commands/Command'
import { menuWithoutProps } from '../csuite/menu/Menu'
import { SimpleMenuAction } from '../csuite/menu/SimpleMenuAction'
import { Trigger } from '../csuite/trigger/Trigger'

export type PanelHeader = { title: string; icon?: IconName }

export class Panel<Props> {
    $PanelHeader!: PanelHeader
    $Props!: Props

    /** default command to open the panel with default props */
    defaultCommand: Command

    constructor(
        public p: {
            //
            name: string
            widget: () => React.FC<Props>
            header: (p: NoInfer<Props>) => PanelHeader
            icon?: IconName
            def: () => NoInfer<Props>
            presets?: { [name: string]: () => NoInfer<Props> }
        },
    ) {
        this.defaultCommand = command({
            id: 'panel.default.open.' + this.name,
            description: `Open ${this.name} panel`,
            label: this.name,
            ctx: ctx_global,
            action: () => {
                const props: Props = this.p.def()
                cushy.layout.FOCUS_OR_CREATE(this.name as any, props, 'LEFT_PANE_TABSET')
                return Trigger.Success
            },
            icon: this.icon,
        })
    }

    get name(): string {
        return this.p.name
    }

    get widget(): React.FC<Props> {
        return this.p.widget()
    }

    get header(): (p: NoInfer<Props>) => PanelHeader {
        return this.p.header
    }

    get icon(): IconName | undefined {
        return this.p.icon
    }

    get menuEntries(): MenuEntry[] {
        const presets = Object.entries(this.p.presets ?? {})
        const out: MenuEntry[] = []

        const defEntry = this.defaultCommand /* new SimpleMenuAction({
            label: this.name,
            icon: this.p.icon,
            onPick: () => {
                const props: Props = this.p.def()
                cushy.layout.FOCUS_OR_CREATE(this.name as any, {}, 'LEFT_PANE_TABSET')
            },
        }) */
        if (presets.length === 0) {
            out.push(defEntry)
        } else {
            const sub = presets.map(([name, preset]) => {
                return new SimpleMenuAction({
                    label: name,
                    icon: this.p.icon,
                    onPick: (): void => {
                        const props: Props = preset()
                        cushy.layout.FOCUS_OR_CREATE(this.name as any, props, 'LEFT_PANE_TABSET')
                    },
                })
            })
            const x = menuWithoutProps({
                icon: this.p.icon,
                title: this.name,
                id: this.name,
                entries: () => [defEntry, ...sub],
            }).bind()
            out.push(x)
        }
        return out
    }
}
