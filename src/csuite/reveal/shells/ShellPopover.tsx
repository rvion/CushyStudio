import type { RevealShellProps } from './ShellProps'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../frame/Frame'

export const ShellPopoverUI = observer(function ShellPopoverUI_(p: RevealShellProps) {
    const reveal = p.reveal
    return (
        <Frame
            // make sure the shell intercept focus events
            // when  see _ShellForFocusEvents
            tabIndex={0}
            shadow
            className={reveal.p.tooltipWrapperClassName}
            tw={[
                //
                '_RevealUI pointer-events-auto !bg-green-400 p-5',
                // when we click inside the popup, anchor is blurred but we don't want to close via onAnchorBlur
                // we need some class to check that we're indeed focusing on a child of the popup
                '_ShellForFocusEvents',
            ]}
            onClick={(ev) => {
                reveal.onShellClick(ev)
            }}
            onMouseEnter={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => reveal.onMouseEnterTooltip(ev)}
            onMouseLeave={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => reveal.onMouseLeaveTooltip(ev)}
            // onContextMenu={uist.open}
            style={reveal.posCSS}
        >
            {reveal.p.title != null && (
                <div tw='px-2'>
                    <div tw='py-0.5'>{reveal.p.title}</div>
                    <Frame tw='w-full rounded' base={{ contrast: 0.2 }} style={{ height: '1px' }}></Frame>
                </div>
            )}
            {p.children}
            {/* LOCK */}
            {
                reveal._lock ? (
                    <Frame
                        //
                        icon='mdiLock'
                        text={{ contrast: 0.3 }}
                        tw='italic text-sm flex gap-1 items-center justify-center absolute'
                    >
                        shift+right-click to unlock
                    </Frame>
                ) : null
                // <span tw='opacity-50 italic text-sm flex gap-1 items-center justify-center'>
                //     <Ikon.mdiLockOffOutline />
                //     shift+right-click to lock
                // </span>
            }
        </Frame>
    )
})
