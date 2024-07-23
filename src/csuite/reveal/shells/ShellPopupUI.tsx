import type { RevealShellProps } from './ShellProps'

import { observer } from 'mobx-react-lite'

import { type ModalShellSize, ModalShellUI } from '../../modal/ModalShell'
import { global_RevealStack } from '../RevealStack'

export const ShellPopupXSUI = (p: RevealShellProps): JSX.Element => <ShellPopupUI size='xs' {...p} />
export const ShellPopupSMUI = (p: RevealShellProps): JSX.Element => <ShellPopupUI size='sm' {...p} />
export const ShellPopupLGUI = (p: RevealShellProps): JSX.Element => <ShellPopupUI size='lg' {...p} />
export const ShellPopupXLUI = (p: RevealShellProps): JSX.Element => <ShellPopupUI size='xl' {...p} />

export const ShellPopupUI = observer(function ShellPopupUI_(p: RevealShellProps & { size?: ModalShellSize }) {
    const uist = p.reveal
    return (
        <div // backdrop
            ref={(e) => {
                if (e == null) return global_RevealStack.filter((p) => p !== uist)
                global_RevealStack.push(uist)
            }}
            onKeyUp={(ev) => {
                if (ev.key === 'Escape') {
                    uist.close()
                    ev.stopPropagation()
                    ev.preventDefault()
                }
            }}
            onClick={(ev) => {
                uist.p.onClick?.(ev)
                uist.close()
                ev.stopPropagation()
                // ev.preventDefault()
            }}
            style={{ zIndex: 99999999, backgroundColor: '#0000003d' }}
            tw='pointer-events-auto absolute w-full h-full flex items-center justify-center z-50'
        >
            <ModalShellUI
                size={p.size}
                close={() => {
                    uist.close()
                }}
                title={uist.p.title}
            >
                {p.children}
            </ModalShellUI>
        </div>
    )
})
