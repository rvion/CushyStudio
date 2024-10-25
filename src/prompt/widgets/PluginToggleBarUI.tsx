import type { PromptPlugin } from '../plugins/PromptPlugin'

import { observer } from 'mobx-react-lite'

import { IkonOf } from '../../csuite/icons/iconHelpers'
import { SelectUI } from '../../csuite/select/SelectUI'
import { plugins } from '../plugins/PromptPluginList'

const isActive = (plugin: PromptPlugin): boolean => (cushy.configFile.get(plugin.configKey) ? true : false)
export const PluginToggleBarUI = observer(function PluginToggleBarUI_(p: {}) {
   return (
      <SelectUI<PromptPlugin> //
         multiple
         placeholder='plugins'
         tw='ml-auto'
         frameProps={{ expand: false, className: 'ml-auto' }}
         options={(): PromptPlugin[] => plugins}
         getLabelText={(plugin): string => plugin.title}
         value={(): PromptPlugin[] => plugins.filter(isActive)}
         onOptionToggled={(plugin) => cushy.configFile.set(plugin.configKey, !isActive(plugin))}
         OptionLabelUI={(plugin, where) => {
            if (where === 'anchor') return <IkonOf name={plugin.icon} />
            return '🔶DEFAULT🔶'
         }}
      />
   )
})
