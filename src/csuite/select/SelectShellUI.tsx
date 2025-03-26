import type { RevealShellProps } from '../reveal/shells/ShellProps'

import { Frame } from '../frame/Frame'
import { ShellFocusTrapUI } from '../reveal/shells/utils/ShellFocusTrap'

export const SelectShellUI = obs(function SelectShellUI_(p: RevealShellProps) {
   const reveal = p.reveal
   return (
      <Frame
         // make sure the shell intercept focus events
         // when  see _ShellForFocusEvents
         tabIndex={0}
         ref={p.shellRef}
         className={reveal.p.shellClassName}
         tw={[
            // '_RevealUI', // 🚂
            'pointer-events-auto',
            // 🐦‍🔥 'shadow-xl shadow-neutral-300',
            // 🐦‍🔥 'border border-gray-200 bg-white',
            'overflow-auto',
            'flex flex-col',
            'rounded-md', // should be exactly like the input
            // eslint-disable-next-line no-constant-binary-expression
            false && '!bg-green-400 p-5', // 🔶 debug
            // when we click inside the popup, anchor is blurred but we don't want to close via onAnchorBlur
            // we need some class to check that we're indeed focusing on a child of the popup
            '_ShellForFocusEvents',
         ]}
         // onContextMenu={uist.open}
         onClick={(ev) => reveal.onShellClick(ev)}
         onMouseEnter={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => reveal.onMouseEnterTooltip(ev)}
         onMouseLeave={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => reveal.onMouseLeaveTooltip(ev)}
         // 🍂#2025-02-19-001: related to focus problem for WidgetRelationship; we should do better
         // soon, make sure shells are wrapped at one place only, with propagation controlled by the
         // reveal state rather than here
         onFocus={(ev) => ev.stopPropagation()}
         style={reveal.posCSS}
      >
         <ShellFocusTrapUI reveal={p.reveal} />
         {p.children}
         <ShellFocusTrapUI reveal={p.reveal} />
      </Frame>
   )
})
