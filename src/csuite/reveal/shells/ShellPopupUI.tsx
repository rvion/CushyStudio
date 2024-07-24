import type { RevealShellProps } from './ShellProps'

import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { type ModalShellSize, ModalShellUI } from '../../modal/ModalShell'
import { global_RevealStack } from '../RevealStack'

export const ShellPopupXSUI = (p: RevealShellProps): JSX.Element => <ShellPopupUI size='xs' {...p} />
export const ShellPopupSMUI = (p: RevealShellProps): JSX.Element => <ShellPopupUI size='sm' {...p} />
export const ShellPopupLGUI = (p: RevealShellProps): JSX.Element => <ShellPopupUI size='lg' {...p} />
export const ShellPopupXLUI = (p: RevealShellProps): JSX.Element => <ShellPopupUI size='xl' {...p} />

export const ShellPopupUI = observer(function ShellPopupUI_(p: RevealShellProps & { size?: ModalShellSize }) {
    const reveal = p.reveal
    useEffect(() => {
        reveal.onMouseEnterTooltip()
        return (): void => reveal.onMouseLeaveTooltip()
    })
    return (
        <div // backdrop
            ref={(e) => {
                if (e == null) return global_RevealStack.filter((p) => p !== reveal)
                global_RevealStack.push(reveal)
            }}
            onMouseDown={(ev) => reveal.onBackdropClick(ev)}
            style={{
                zIndex: 99999999,
                backgroundColor: '#0000003d',
            }}
            tw={[
                //
                'pointer-events-auto absolute z-50',
                'w-full h-full',
                // 'flex items-center justify-center',
            ]}
        >
            <ModalShellUI
                style={p.reveal.posCSS}
                size={p.size}
                close={() => {
                    reveal.close('closeButton')
                }}
                title={reveal.p.title}
            >
                {/* <pre>{JSON.stringify(p.reveal.posCSS)}</pre> */}
                {p.children}
            </ModalShellUI>
        </div>
    )
})
