import type { Field_group, Field_group_types } from './FieldGroup'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { UI } from '../../components/UI'
import { useCSuite } from '../../ctx/useCSuite'
import { ListOfFieldsContainerUI } from '../../form/WidgetsContainerUI'
import { WidgetSingleLineSummaryUI } from '../../form/WidgetSingleLineSummaryUI'

// HEADER
export const WidgetGroup_LineUI = observer(function WidgetGroup_LineUI_(p: {
   //
   field: Field_group<Field_group_types<any>>
}) {
   const csuite = useCSuite()
   const field = p.field
   if (p.field.serial.collapsed)
      return <WidgetSingleLineSummaryUI>{p.field.summary}</WidgetSingleLineSummaryUI>

   const presets = field.config.presets
   const presetCount = presets?.length ?? 0
   const out: ReactNode[] = []
   const showFoldButtons = csuite.showFoldButtons
   const hasFoldableSubfields = field.hasFoldableSubfields
   if (presets && presetCount > 0 && field.config.presetButtons) {
      out.push(
         ...presets.map((preset, ix) => (
            <UI.Button //
               key={preset.label + ix}
               // square
               // subtle
               icon={preset.icon}
               onClick={(ev) => {
                  preset.apply(field)
                  ev.stopPropagation()
                  field.touch()
               }}
               children={preset.label}
            />
         )),
      )
   }
   if (showFoldButtons && hasFoldableSubfields) {
      out.push(
         <div tw='ml-auto flex gap-0.5' key='lShd8JZuFZ'>
            <Button //
               square
               subtle
               borderless
               icon='mdiUnfoldMoreHorizontal'
               disabled={!field.hasFoldableSubfieldsThatAreFolded}
               onClick={() => {
                  p.field.expandAllChildren()
                  field.touch()
               }}
            />

            <Button //
               square
               subtle
               borderless
               icon='mdiUnfoldLessHorizontal'
               disabled={!field.hasFoldableSubfieldsThatAreUnfolded}
               onClick={() => {
                  p.field.collapseAllChildren()
                  field.touch()
               }}
            />
         </div>,
      )
   }
   if (out.length == 0) return null
   return out
})

export const WidgetGroup_BlockUI = observer(function WidgetGroup_BlockUI_<T extends Field_group>(p: {
   //
   className?: string
   field: T
}) {
   const field = p.field
   const children = field.childrenActive
   const isHorizontal = field.config.layout === 'H'

   return (
      <ListOfFieldsContainerUI //
         layout={p.field.config.layout}
         tw={[field.config.className, p.className]}
      >
         {children.map((child, ix) => {
            const shouldJustifyLabel = isHorizontal ? false : field.config.justifyLabel
            return (
               <child.UI
                  key={child.mountKey}
                  Indent={(p.field.config.layout === 'H' ? ix === 0 : true) ? undefined : null}
               />
            )
         })}
      </ListOfFieldsContainerUI>
   )
})

export const WidgetGroupInlineUI = observer(function WidgetGroupInline_<T extends Field_group>(p: {
   className?: string
   field: T
}) {
   const field = p.field
   const children = field.childrenActive
   return (
      <div tw={[field.config.className, p.className, 'flex']}>
         {children.map((child, ix) => {
            return <child.UI key={child.mountKey} />
         })}
      </div>
   )
})
