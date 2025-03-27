import type { StandardProps } from '../../presenters/RenderProps'

export type WidgetPadProps = {
   children: any
   /** Enables the theme-based padding */
   enable?: boolean
} & StandardProps['wrappers']

/** Decoration that gives horizontal padding, uses `group.padding` theme option */
export const WidgetPadUI = obs(function WidgetPadUI_(p: WidgetPadProps) {
   const theme = cushy.preferences.theme.zValue

   return (
      <div
         style={{
            //
            paddingLeft: `${theme.groups.padding}rem`,
            paddingRight: `${theme.groups.padding}rem`,
         }}
      >
         {p.children}
      </div>
   )
})
