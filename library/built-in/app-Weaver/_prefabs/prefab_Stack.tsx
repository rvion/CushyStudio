import type { IconName } from '../../../../src/csuite/icons/IconName'
import type { $WeaverLatent } from './latent/prefab_weaver_latent'
import type { $WeaverPromptList } from './prompting/WeaverPrompting'

export type StackType = 'conditioning' | 'latent'

export type StackData = Z.Record<{
   name: Z.String
   data: Z.Optional<
      Z.Choices<{
         prompting: $WeaverPromptList
         latent: $WeaverLatent
      }>
   >
}>

export const StackCardUI = obs(function StackCardUI_(p: {
   // For some reason tw returns undefined so use this I guess???
   isDnDHovered?: boolean
   field: StackData['{field}']
   stackField: Z.List<StackData>['{field}']
   stackIndex: number
   icon?: Maybe<IconName>
   children?: React.ReactNode
}) {
   const theme = cushy.preferences.theme.zValue

   return (
      <uy.misc.Frame
         tw='overflow-clip'
         base={{ contrast: 0.1 }}
         border={p.isDnDHovered ? { contrast: 0.2 } : theme.groups.border}
         roundness={theme.global.roundness}
      >
         <uy.misc.Frame tw='select-none !gap-2 px-1 py-1' line>
            <uy.misc.Frame row line linegap={false}>
               <uy.inputs.InputBoolUI
                  tw='!border-none !bg-transparent'
                  // subtle
                  square
                  size='input'
                  display='button'
                  toggleGroup='h802w4ggh704b9w34gb9'
                  // borderless
                  value={p.field.zIsCollapsed}
                  icon={p.field.zIsCollapsed ? IKONS.mdiChevronRight : IKONS.mdiChevronDown}
                  onValueChange={() => {
                     p.field.zToggleCollapsed()
                  }}
               />
               <uy.misc.Frame square size='input' icon={p.icon} />
            </uy.misc.Frame>
            <uy.misc.Frame
               //
               align
               border
               expand
               line
               row
               dropShadow={theme.global.shadow}
               roundness={theme.global.roundness}
            >
               <uy.string.input field={p.field.name} />
               <uy.inputs.InputBoolUI
                  display='button'
                  square
                  size={'input'}
                  toggleGroup='stackEnable'
                  value={p.field.data.isActive}
                  onValueChange={(value) => {
                     p.field.data.setActive(value)
                  }}
                  icon={
                     p.field.data.isActive
                        ? IKONS.mdiCheckboxBlankCircle
                        : IKONS.mdiCheckboxBlankCircleOutline
                  }
               />
            </uy.misc.Frame>
            <uy.misc.Button
               tw='!border-none !bg-transparent'
               subtle
               square
               size='input'
               icon={IKONS.mdiClose}
               onClick={() => {
                  p.stackField.removeItemAt(p.stackIndex)
               }}
            />
         </uy.misc.Frame>
         {!p.field.zIsCollapsed && p.children}
      </uy.misc.Frame>
   )
})
