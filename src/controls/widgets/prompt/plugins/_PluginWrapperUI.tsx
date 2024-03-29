import type { PromptPlugin } from './PromptPlugin'

import { observer } from 'mobx-react-lite'

export const PluginWrapperUI = observer(function PluginWrapperUI_(p: {
    //
    plugin: PromptPlugin
    children?: React.ReactNode
}) {
    const plugin = p.plugin
    return (
        <div tw='bg-base-300 p-1 flex gap-1'>
            {/* <div tw='btn btn-icon btn-square btn-sm btn-outline text-lg'> */}
            <span className='material-symbols-outlined'>{plugin.icon}</span>
            <div>
                <div tw='italic text-gray-500 text-sm'>Plugin: {plugin.title}</div>
                {p.children}
            </div>
        </div>
    )
})
