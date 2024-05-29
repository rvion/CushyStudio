import type { PromptPlugin } from './PromptPlugin'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../../../../icons/iconHelpers'
import { BoxUI } from '../../../../rsuite/box/BoxUI'

export const PluginWrapperUI = observer(function PluginWrapperUI_(p: {
    //
    plugin: PromptPlugin
    children?: React.ReactNode
}) {
    const plugin = p.plugin
    const Icon = Ikon[plugin.icon]
    return (
        <BoxUI base={3} tw='flex gap-1'>
            {/* <div tw='btn btn-icon btn-square btn-sm btn-outline text-lg'> */}
            {/* <span className='material-symbols-outlined'>{plugin.icon}</span> */}
            <Icon />
            <div>
                <div tw='italic text-gray-500 text-sm'>Plugin: {plugin.title}</div>
                {p.children}
            </div>
        </BoxUI>
    )
})
