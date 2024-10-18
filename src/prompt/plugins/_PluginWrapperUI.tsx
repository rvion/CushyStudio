import type { PromptPlugin } from './PromptPlugin'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'
import { Ikon } from '../../csuite/icons/iconHelpers'

export const PluginWrapperUI = observer(function PluginWrapperUI_(p: {
    //
    plugin: PromptPlugin
    children?: React.ReactNode
}) {
    const plugin = p.plugin
    const Icon = Ikon[plugin.icon]
    return (
        <Frame>
            <div tw='align-center flex gap-1 text-sm italic text-gray-500'>
                <Icon /> Plugin {plugin.title}
            </div>
            {p.children}
        </Frame>
    )
})
