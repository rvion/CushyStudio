import type { RevealShellProps } from './ShellProps'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../frame/Frame'

export const ShellPopoverUI = observer(function ShellPopoverUI_(p: RevealShellProps) {
    const uist = p.reveal
    return (
        <Frame
            shadow
            className={uist.p.tooltipWrapperClassName}
            tw={['_RevealUI pointer-events-auto']}
            onClick={(ev) => ev.stopPropagation()}
            onMouseEnter={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => uist.onMouseEnterTooltip(ev)}
            onMouseLeave={(ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => uist.onMouseLeaveTooltip(ev)}
            // onContextMenu={uist.open}
            style={uist.posCSS}
        >
            {uist.p.title != null && (
                <div tw='px-2'>
                    <div tw='py-0.5'>{uist.p.title}</div>
                    <Frame tw='w-full rounded' base={{ contrast: 0.2 }} style={{ height: '1px' }}></Frame>
                </div>
            )}
            {p.children}

            {/* LOCK */}
            {
                uist._lock ? (
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
