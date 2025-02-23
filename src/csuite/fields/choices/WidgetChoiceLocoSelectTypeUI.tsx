import type { WidgetProps } from '../../../../../csuite-loco/renderer/Renderer.types'
import type { SchemaDict } from '../../model/SchemaDict'
import type { Field_choices } from './FieldChoices'

import { observer } from 'mobx-react-lite'

import { justifiedStyle } from '../../../../../csuite-loco/wrappers/WrappersLabel'
import { Button } from '../../../../../front/lsuite/Button'
import { csuiteConfig } from '../../config/configureCsuite'
import { SelectUI } from '../../select/SelectUI'

export const WidgetChoiceLocoSelectTypeUI = observer(function WidgetChoiceLocoSelectTypeUI_<
   T extends SchemaDict,
>(
   p: WidgetProps<Field_choices<T>> & {
      /** @default true */
      stretchSelect?: boolean
      /** @default true */
      showType?: boolean
   },
) {
   const field = p.field
   type Entry = { key: string; label: string }
   const choices: Entry[] = field.choicesWithLabels

   const isActive = !p.field.canBeToggledWithinParent || p.field.isEnabledWithinParent
   const appearance = field.config.appearance ?? 'select'

   const selectUI = (
      <SelectUI<Entry>
         key={`${isActive}`}
         tw='flex-grow'
         placeholder={p.field.config.placeholder ?? csuiteConfig.i18n.ui.field.empty}
         value={() =>
            isActive
               ? field.activeBranchNames.map((key) => ({
                    key,
                    label: choices.find((v) => v.key === key)?.label ?? key,
                 }))
               : []
         }
         options={() => choices}
         getLabelText={(v) => v.label}
         OptionLabelUI={(v) => v.label}
         equalityCheck={(a, b) => a.key === b.key}
         multiple={field.config.multi ?? false}
         // closeOnPick={false}
         resetQueryOnPick={false}
         onOptionToggled={(v) => {
            if (p.field.canBeToggledWithinParent) p.field.enableSelfWithinParent()
            field.toggleBranch(v.key)
            p.field.touch()
         }}
      />
   )

   const label = p.label == null || p.label == false ? {} : p.label

   return (
      <Row>
         {/* 🔶 2024-11-22 domi: copy pasted from default wrapper label, pretty bad */}
         {p.showType !== false && (
            <Row //
               tw='minh-input'
               {...label?.dov}
               style={{ ...justifiedStyle, ...label?.dov?.style }}
            >
               Type
            </Row>
         )}
         {/* 2024-11-27 domi: intermediate Col stretch as a bad way to make SelectUI grow 🙈 */}
         {p.stretchSelect !== false ? (
            <Col align='stretch' expand tw='min-w-16 justify-start '>
               {selectUI}
            </Col>
         ) : (
            selectUI
         )}
         {p.field.canBeToggledWithinParent && appearance === 'select' && (
            <Button
               look='subtle'
               icon={IKONS.mdiClose}
               size='input'
               disabled={!isActive}
               onClick={() => {
                  field.disableSelfWithinParent()
                  p.field.touch()
               }}
            />
         )}
      </Row>
   )
})
