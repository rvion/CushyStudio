import { observer } from 'mobx-react-lite'

import { Frame, type FrameProps } from '../frame/Frame'

/**
 * Re-usable Dock-Panel Header, gives a full width bar and a horizontal flex to put widgets in.
 *
 * `NOTE`: It will automatically set the height of any child widgets.
 *
 * Example:
 *
 * ```
 * <PanelHeaderUI>
 *      <Button>Hello World!<Button>
 * </PanelHeaderUI>
 * ```
 */
export const PanelHeaderUI = observer(function PanelHeader({
    // own props ---------------------------------------------------------------------
    /** extensible flag makes the panel header have minh-widget instead of h-widget */
    extensibleHeight,
    title,

    // modified ----------------------------------------------------------------------
    children,

    // rest ---------------------------------------------------------------------------
    ...rest
}: {
    extensibleHeight?: boolean
    title?: string
    //
} & FrameProps) {
    return (
        <Frame // Container
            base={{ contrast: 0.08 /* hueShift: 100 */ /* chromaBlend: 2 */ }}
            tw={[
                //
                'sticky top-0 [z-index:999]',
                'px-0.5',
                extensibleHeight //
                    ? 'minh-widget shrink-0'
                    : 'h-widget',
                'UI-PanelHeader',
                'CSHY-panel-header',
                'flex gap-1 select-none',
                'overflow-auto',
                'items-center',
                // 'flex-wrap',
            ]}
            onWheel={(event) => {
                event.currentTarget.scrollLeft += event.deltaY
                event.stopPropagation()
            }}
            {...rest}
        >
            {title && <div>{title}</div>}
            {children}
        </Frame>
    )
})
