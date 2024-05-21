import type { IconName } from '../../icons/icons'
import type { IWidget } from '../IWidget'
import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'
import { ErrorBoundary } from 'react-error-boundary'

import { Ikon, IkonOf } from '../../icons/iconHelpers'
import { RevealUI } from '../../rsuite/reveal/RevealUI'
import { Box } from '../../theme/colorEngine/Box'
import { makeLabelFromFieldName } from '../../utils/misc/makeLabelFromFieldName'
import { ErrorBoundaryFallback } from '../../widgets/misc/ErrorBoundary'
import { AnimatedSizeUI } from '../utils/AnimatedSizeUI'
import { isWidgetGroup, isWidgetOptional } from '../widgets/WidgetUI.DI'
import { getActualWidgetToDisplay } from './getActualWidgetToDisplay'
import { getBorderStatusForWidget } from './getBorderStatusForWidget'
import { getIfWidgetIsCollapsible } from './getIfWidgetIsCollapsible'
import { getIfWidgetNeedAlignedLabel } from './getIfWidgetNeedAlignedLabel'
import { Widget_ToggleUI } from './Widget_ToggleUI'
import { menu_widgetActions } from './WidgetMenu'
import { WidgetTooltipUI } from './WidgetTooltipUI'

let isDragging = false
let wasEnabled = false

export const WidgetWithLabelUI = observer(function WidgetWithLabelUI_(p: {
    widget: IWidget
    rootKey: string
    isTopLevel?: boolean
    alignLabel?: boolean
    /**
     * override the label (false to force disable the label)
     * some widget like `choice`, already display the selected header in their own way
     * so they may want to skip the label.
     * */
    label?: string | false
}) {
    if (p.widget.config.hidden) return null
    const rootKey = p.rootKey
    const originalWidget = p.widget
    const widget = getActualWidgetToDisplay(originalWidget)
    const isDisabled = isWidgetOptional(originalWidget) && !originalWidget.serial.active

    const HeaderUI = widget.header()
    const BodyUI = widget.body()

    const isCollapsible: boolean = getIfWidgetIsCollapsible(widget)
    const isCollapsed = (widget.serial.collapsed ?? isDisabled) && isCollapsible

    const alignLabel = p.alignLabel ?? getIfWidgetNeedAlignedLabel(widget)
    // ------------------------------------------------------------
    // quick hack to prevent showing emtpy groups when there is literally nothing interesting to show
    const k = widget
    if (
        isWidgetGroup(k) && //
        Object.keys(k.fields).length === 0 /* &&
        k.config.requirements == null */
    ) {
        return null
    }
    // ------------------------------------------------------------

    // ⏸️ const onLabelClick = () => {
    // ⏸️     // if the widget is collapsed, clicking on the label should expand it
    // ⏸️     if (widget.serial.collapsed) return widget.setCollapsed(false)
    // ⏸️     // if the widget can be collapsed, and is expanded, clicking on the label should collapse it
    // ⏸️     if (isCollapsible && !widget.serial.collapsed) return widget.setCollapsed(true)
    // ⏸️     // if the widget is not collapsible, and is optional, clicking on the label should toggle it
    // ⏸️     if (!isCollapsible && isWidgetOptional(originalWidget)) return originalWidget.toggle()
    // ⏸️ }

    const showBorder = getBorderStatusForWidget(widget)

    const labelText: string | false = (() => {
        // if parent widget wants to override the label (or disable it with false), we accept
        if (p.label != null) return p.label
        // if widget defines it's own label (or disable it with false), we accept
        if (widget.config.label != null) return widget.config.label
        // if parent told use which `key` this sub-widget was mounted to, we use that to derive a label
        return makeLabelFromFieldName(p.rootKey)
    })()

    const LABEL = (
        // <span onClick={onLabelClick} style={{ lineHeight: '1rem' }}>
        <span
            tw={[isCollapsed || isCollapsible ? 'cursor-pointer' : null]}
            className='COLLAPSE-PASSTHROUGH'
            style={{ lineHeight: '1rem' }}
        >
            {labelText}
            {widget.config.showID ? <span tw='opacity-50 italic text-sm'>#{widget.id.slice(0, 3)}</span> : null}
        </span>
    )

    const styleDISABLED: CSSProperties | undefined = isDisabled
        ? { pointerEvents: 'none', opacity: 0.3, backgroundColor: 'rgba(0,0,0,0.05)' }
        : undefined

    const isDraggingListener = (ev: MouseEvent) => {
        if (ev.button == 0) {
            isDragging = false
            window.removeEventListener('mouseup', isDraggingListener, true)
        }
    }

    const iconName = widget.icon
    return (
        <Box
            key={rootKey}
            tw={[
                // widget.background && (isCollapsible || showBorder) && 'bg-base-100',
                showBorder && 'WIDGET-GROUP-BORDERED',
                p.isTopLevel ? 'TOP-LEVEL-FIELD' : 'SUB-FIELD',
                widget.type,
            ]}
            base={widget.background && (isCollapsible || showBorder) ? { contrast: 0.04 } : undefined}
            {...p.widget.config.box}
        >
            <AnimatedSizeUI>
                {/*
                    LINE part
                    (label, collapse button, toggle button, tooltip, etc.)
                    Only way to have it completely disabled is to have no label, no tooltip, no requirements, etc.
                */}
                <div
                    className='WIDGET-HEADER COLLAPSE-PASSTHROUGH'
                    tw={['flex items-center gap-0.5 select-none']}
                    /*
                     * bird_d:
                     *  | Have the whole header able to collapse the panel,
                     *  | any actual buttons in the header should prevent this themselves.
                     *  | Also will continue to expand/collapse any panel that is hovered over while dragging.
                     * 2024-02-29 rvion: this broke 3/4 widgets who did not preventDefault in their header;
                     *  | may cause more problems later; not sure how to make this sligtly safer / easy to test.
                     * 2024-03-10 bird_d: I added a COLLAPSE-PASSTHROUGH className. So things have to opt-in now.
                     *  | This should workaround widgets not preventing their own event.
                     * */
                    onMouseDown={(ev) => {
                        if (ev.button != 0 || !isCollapsible) return
                        const target = ev.target as HTMLElement
                        if (!target.classList.contains('COLLAPSE-PASSTHROUGH')) return
                        isDragging = true
                        window.addEventListener('mouseup', isDraggingListener, true)
                        wasEnabled = !widget.serial.collapsed
                        widget.setCollapsed(wasEnabled)
                    }}
                    /* 2024-02-29 rvion: not quite sure this is the right logic now
                     * | do we want to call the now usused `onLabelClick()` function instead (defined above)
                     * 2024-03-10 bird_d: The switch to onMouseMove should make this feel a lot better.
                     * | It shouldn't continue to close panels while holding the click as the ui moves out from under the user.
                     * */

                    onMouseMove={(ev) => {
                        if (!isDragging || !isCollapsible) return
                        widget.setCollapsed(wasEnabled)
                    }}
                >
                    <span
                        tw={[
                            'flex justify-end gap-0.5 flex-none items-center shrink-0',
                            // p.isTopLevel && !isDisabled ? 'font-bold' : 'text-base',
                            // 🔴 label COLOR here
                            // isDisabled ? undefined : 'text-primary',
                        ]}
                        style={
                            alignLabel
                                ? {
                                      textAlign: 'right',
                                      minWidth: '8rem',
                                      width: alignLabel && HeaderUI ? '35%' : undefined,
                                      marginRight: alignLabel && HeaderUI ? '0.25rem' : undefined,
                                  }
                                : undefined
                        }
                    >
                        <Box tw='flex items-center' text={{ hueShift: 0, contrast: 0.9, chromaBlend: 1 }}>
                            {/* COLLAPSE */}
                            {(isCollapsed || isCollapsible) && (
                                <span className='WIDGET-COLLAPSE-BTN COLLAPSE-PASSTHROUGH material-symbols-outlined opacity-70 hover:opacity-100 cursor-pointer'>
                                    {isCollapsed ? 'chevron_right' : 'expand_more'}
                                </span>
                            )}
                            {iconName && (
                                <Box tw='mr-1' text={{ chroma: 0.2, contrast: 0.9 }}>
                                    <IkonOf name={iconName} />
                                </Box>
                            )}
                            {/* TOGGLE BEFORE */}
                            {BodyUI && <Widget_ToggleUI widget={originalWidget} />}
                            {/* REQUIREMENTS (in cushy) OR OTHER CUSTOM LABEL STUFF */}
                            {widget.spec.LabelExtraUI && <widget.spec.LabelExtraUI widget={widget} />}
                            {/* TOOLTIPS  */}
                            {widget.config.tooltip && <WidgetTooltipUI widget={widget} />}
                            {LABEL}
                        </Box>
                        {/* TOOGLE (after)  */}
                        {!BodyUI && <Widget_ToggleUI widget={originalWidget} />}
                    </span>
                    {HeaderUI && (
                        <div className='COLLAPSE-PASSTHROUGH' tw='flex items-center gap-0.5 flex-1' style={styleDISABLED}>
                            <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                                {HeaderUI}
                            </ErrorBoundary>
                        </div>
                    )}
                    {widget.config.presets && (
                        <RevealUI //
                            content={() => <menu_widgetActions.UI props={widget} />}
                        >
                            <Ikon.mdiBook />
                        </RevealUI>
                    )}
                </div>

                {/* BLOCK */}
                {BodyUI && !isCollapsed && (
                    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onReset={(details) => {}}>
                        <div style={styleDISABLED} tw={[isCollapsible && 'WIDGET-BLOCK']}>
                            {BodyUI}
                        </div>
                    </ErrorBoundary>
                )}
                {/* ERRORS */}
                {widget.hasErrors && (
                    <div tw='widget-error-ui'>
                        {widget.errors.map((e, i) => (
                            <div key={i} tw='flex items-center gap-1'>
                                <span className='material-symbols-outlined'>error</span>
                                {e.message}
                            </div>
                        ))}
                    </div>
                )}
            </AnimatedSizeUI>
        </Box>
    )
})
