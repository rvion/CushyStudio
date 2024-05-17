import { command, type Command } from '../../operators/Command'
import { ctx_global } from '../../operators/contexts/ctx_global'

export const cmd_maximizePanel: Command = command({
    id: 'maximizePanel',
    label: 'Maximize Panel',
    ctx: ctx_global,
    combos: 'ctrl+space',
    action: () => cushy.layout.maximizeCurrentPanel(),
})
