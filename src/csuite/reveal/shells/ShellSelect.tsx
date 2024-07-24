import type { RevealShellProps } from './ShellProps'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../frame/Frame'

export const ShellSelectUI = observer(function ShellSelectUI_(p: RevealShellProps) {
    const uist = p.reveal
    // const trueMinWidth = '40rem'
    // const minWidth =
    //     s.anchorRef.current?.clientWidth != null //
    //         ? `max(${s.anchorRef.current.clientWidth}px, ${trueMinWidth})`
    //         : trueMinWidth
    // const maxWidth = window.innerWidth - (s.tooltipPosition.left != null ? s.tooltipPosition.left : s.tooltipPosition.right ?? 0)
    // const maxHeight = `${s.tooltipMaxHeight}px`

    return (
        <Frame
            shadow
            className={uist.p.tooltipWrapperClassName}
            tw={['_RevealUI pointer-events-auto']}
            onClick={(ev) => ev.stopPropagation()}
            onMouseEnter={uist.onMouseEnterTooltip}
            onMouseLeave={uist.onMouseLeaveTooltip}
            onContextMenu={uist.enterAnchor}
            style={uist.posCSS}
        >
            {p.children}
        </Frame>
    )
})

/*


<Frame
    ref={s.popupRef}
    tw={[
        'MENU-ROOT _SelectPopupUI flex',
        'overflow-auto flex-col',
        s.tooltipPosition.bottom != null ? 'rounded-t border-t' : 'rounded-b border-b',
    ]}
    onMouseUp={() => s.closeIfShouldCloseAfterSelection()}
    style={{
        minWidth,
        maxWidth,
        maxHeight,
        pointerEvents: 'initial',
        position: 'absolute',
    }}
    // Prevent close when clicking the pop-up frame. There are also small gaps between the buttons where this becomes an issue.
    onMouseDown={(ev) => {
        ev.preventDefault()
        ev.stopPropagation()
    }}
    onMouseEnter={(ev) => {
        if (s.isOpen) s.hasMouseEntered = true
    }}
>
*/
