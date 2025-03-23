import type { OpenRouter_ModelInfo } from '../../openrouter/OpenRouter_ModelInfo'
import type { OpenRouter_Models } from '../../openrouter/OpenRouter_models'
import type { BuilderBoolMixin } from './BuilderBoolTypes'
import type { BuilderSelectOneMixin } from './BuilderSelectOne'

import { WidgetButtonUI } from '../../fields/button/WidgetButtonUI'
import { allOpenrouterModels, openRouterInfos_ } from '../../openrouter/OpenRouter_infos'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'

type FieldLLM = Z.OneOf<OpenRouter_ModelInfo, OpenRouter_Models>
type FieldLLMCOnfig = { default?: OpenRouter_Models }

export type BuilderLLMMixin = {
   llmModel(config?: FieldLLMCOnfig): FieldLLM
   button(p: { onClick: () => void }): Z.Bool
}

const BuilderLLMImpl = (): BuilderLLMMixin =>
   defineSchemaBuilderMixin<BuilderLLMMixin>({
      llmModel(p: FieldLLMCOnfig = {}): FieldLLM {
         // 💬 2025-03-17 rvion: let's pretend `this` has acess to selectOne
         const self = this as any as BuilderSelectOneMixin

         // const def = p.default ? allOpenrouterModels.find((c) => c.id === p.default) : undefined
         return self.selectOne<OpenRouter_ModelInfo, OpenRouter_Models>({
            default: p.default,
            values: () => allOpenrouterModels,
            getIdFromValue: (v) => v.id,
            getOptionFromId: (id) => ({ id, value: openRouterInfos_[id]! }),
            getValueFromId: (id) => openRouterInfos_[id]!,
         })
      },

      button: ({ onClick }: { onClick: () => void }): Z.Bool => {
         const self = this as any as BuilderBoolMixin
         return self.bool({
            uiui: {
               Header: (p: Z.UIProps<Z.FBool>) => (
                  <WidgetButtonUI //
                     field={p.field}
                     onClick={onClick}
                  />
               ),
            },
         })
      },
   })

export const BuilderLLMDescriptors = Object.getOwnPropertyDescriptors(BuilderLLMImpl())
