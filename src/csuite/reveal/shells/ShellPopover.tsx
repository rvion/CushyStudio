import type { RevealShellProps } from './ShellProps'

import { Frame } from '../../frame/Frame'
import { ShellFocusTrapUI } from './utils/ShellFocusTrap'

export const ShellPopoverUI = obs(function ShellPopoverUI_(p: RevealShellProps) {
   const reveal = p.reveal
   const locked = reveal._lock
   return (
      <Frame
         // make sure the shell intercept focus events
         // when  see _ShellForFocusEvents
         ref={p.shellRef}
         tabIndex={0}
         shadow
         className={reveal.p.shellClassName}
         tw={[
            //
            '_RevealUI pointer-events-auto ',
            // false && '!bg-green-400 p-5', // 🔶 debug
            // when we click inside the popup, anchor is blurred but we don't want to close via onAnchorBlur
            // we need some class to check that we're indeed focusing on a child of the popup
            '_ShellForFocusEvents',
         ]}
         // roundness={cushy.preferences.theme.value.global.roundness}
         border={
            locked ? { hue: 0, contrast: 0.2, chromaBlend: 500 } : undefined
            // cushy.preferences.theme.value.global.border
         }
         // dropShadow={cushy.preferences.theme.value.global.shadow}
         // onContextMenu={uist.open}
         onClick={(ev) => reveal.onShellClick(ev)}
         onMouseEnter={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => reveal.onMouseEnterTooltip(ev)}
         onMouseLeave={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => reveal.onMouseLeaveTooltip(ev)}
         // 🍂#2025-02-19-001: related to focus problem for WidgetRelationship; we should do better
         // soon, make sure shells are wrapped at one place only, with propagation controlled by the
         // reveal state rather than here
         onFocus={(ev) => ev.stopPropagation()}
         style={{
            borderStyle: locked ? 'dashed' : 'inherit',
            ...reveal.posCSS,
         }}
      >
         {reveal.p.title != null && (
            <div tw='px-2'>
               <div tw='py-0.5'>{reveal.p.title}</div>
               <Frame tw='w-full rounded' base={{ contrast: 0.2 }} style={{ height: '1px' }}></Frame>
            </div>
         )}

         {p.children}
         {locked ? (
            <Frame // LOCK
               icon={IKONS.mdiLock}
               text={{ contrast: 0.3 }}
               tw='flex select-none items-center justify-center gap-1 text-sm italic'
            >
               shift+right-click to unlock
            </Frame>
         ) : null}
         <ShellFocusTrapUI reveal={p.reveal} />
      </Frame>
   )
})
