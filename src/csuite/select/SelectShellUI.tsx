import type { RevealShellProps } from '../reveal/shells/ShellProps'

import { observer } from 'mobx-react-lite'

export const SelectShellUI = observer(function SelectShellUI_(p: RevealShellProps) {
    const reveal = p.reveal
    return (
        <div
            // make sure the shell intercept focus events
            // when  see _ShellForFocusEvents
            tabIndex={0}
            className={reveal.p.shellClassName}
            tw={[
                // '_RevealUI', // 🚂
                'pointer-events-auto',
                'shadow-xl shadow-neutral-300',
                'bg-white border border-gray-200',
                'overflow-auto',
                'flex flex-col',
                'rounded-md', // should be exactly like the input
                false && '!bg-green-400 p-5', // 🔶 debug
                // when we click inside the popup, anchor is blurred but we don't want to close via onAnchorBlur
                // we need some class to check that we're indeed focusing on a child of the popup
                '_ShellForFocusEvents',
            ]}
            // onContextMenu={uist.open}
            onClick={(ev) => reveal.onShellClick(ev)}
            onMouseEnter={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => reveal.onMouseEnterTooltip(ev)}
            onMouseLeave={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => reveal.onMouseLeaveTooltip(ev)}
            style={reveal.posCSS}
        >
            {p.children}
        </div>
    )
})
