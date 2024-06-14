import { command } from '../../csuite/commands/Command'
import { Trigger } from '../../csuite/trigger/Trigger'
import { ctx_global } from '../contexts/ctx_global'

export const cmd_fav_toggleFavBar = command({
    id: 'fav.toggleFavBar',
    label: 'Toggle FavBar',
    combos: 'mod+b',
    ctx: ctx_global,
    action: () => {
        cushy.favbar.root.fields.visible.toggle()
        return Trigger.Success
    },
})
