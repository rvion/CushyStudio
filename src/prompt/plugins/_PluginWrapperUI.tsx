import type { PromptPlugin } from './PromptPlugin'

import { Frame } from '../../csuite/frame/Frame'
import { Ikon2 } from '../../csuite/icons/iconHelpers'

export const PluginWrapperUI = obs(function PluginWrapperUI_(p: {
   //
   plugin: PromptPlugin
   children?: React.ReactNode
}) {
   const plugin = p.plugin
   const Icon = Ikon2[plugin.icon]
   return (
      <Frame>
         <div tw='align-center flex gap-1 text-sm italic text-gray-500'>
            <Icon /> Plugin {plugin.title}
         </div>
         {p.children}
      </Frame>
   )
})
