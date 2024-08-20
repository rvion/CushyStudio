import type { BoxBasicProps } from '../../box/BoxUIProps'
import type { IconName } from '../../icons/icons'
import type { TintExt } from '../../kolor/Tint'
import type { RevealPlacement } from '../../reveal/RevealPlacement'

import { observer } from 'mobx-react-lite'
import React, { type CSSProperties, type ForwardedRef, forwardRef, type MouseEvent, useId, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { usePressLogic } from '../../button/usePressLogic'
import { hashStringToNumber } from '../../hashUtils/hash'
import { IkonOf } from '../../icons/iconHelpers'
import { registerComponentAsClonableWhenInsideReveal } from '../../reveal/RevealCloneWhitelist'
import { getDOMElementDepth } from '../../utils/getDOMElementDepth'
import { tooltipStuff } from '../tooltip'
import { appearanceCVA, type DovAppearanceProps, type DovLook, type DovSize, lookToProps } from './DovAppearance'
import { type DovFlexProps, flexCVA, lookToFlexProps } from './DovFlex'

export type SimpleBoxShadow = {
    inset?: boolean
    x?: number
    y?: number
    blur?: number
    spread?: number
    color?: TintExt
}

export type DovProps = {
    //
    as?: string | React.ElementType

    tooltip?: string
    tooltipPlacement?: RevealPlacement

    // quick layout ----------------------------------------------------
    /** quick layout feature to add `flex flex-row` */
    row?: boolean
    /** quick layout feature to add `flex flex-row items-center` */
    line?: boolean
    linegap?: boolean
    /** quick layout feature to add `flex flex-row` */
    col?: boolean

    // hovering --------------------------------------------------------

    /** allow to pretend the frame is hovered */
    hovered?: (reallyHovered: boolean) => boolean | undefined

    // logic --------------------------------------------------
    /** TODO: */
    triggerOnPress?: { startingState: boolean }
    // STATES MODIFIERS ------------------------------------------------
    active?: Maybe<boolean>
    loading?: boolean
    disabled?: boolean

    // FITT size -------------------------------------------------------
    // /** when true flex=1 */
    expand?: boolean

    // ICON ------------------------------------------------------------
    icon?: Maybe<IconName>
    iconSize?: string

    suffixIcon?: Maybe<IconName>

    // Loco
    debug?: boolean
    debugColor?: boolean
    debugId?: string
    look?: Maybe<DovLook>
    size?: DovSize
    square?: boolean
} & BoxBasicProps &
    DovFlexProps &
    DovAppearanceProps

export const Dov = observer(
    forwardRef(function Dov_(p: DovProps, ref: ForwardedRef<HTMLDivElement>) {
        // PROPS --------------------------------------------
        // prettier-ignore
        const {
            as,                                                 // html

            active, disabled,                                   // built-in state & style modifiers
            icon, iconSize, suffixIcon, loading,                // addons
            expand, square, size,                               // size

            style, className,                                   // style: 4/4: css, className


            hovered: hovered__,                                 // state
            onMouseDown, onMouseEnter: onMouseEnter__, onClick, triggerOnPress, // interractions
            tooltip, tooltipPlacement,

            row, line, col,                                     // layout
            gap, direction, align, justify, wrap, flex,         // flex
            dominant, inverted, typography, bordered, hoverable, look, // appearance

            debug, debugColor,                                 // debug

            // remaining properties
            ...rest
        } = p

        const log = (...args: any[]): void => {
            if (p.debugId != null) console.log(`🔴 ~ ${p.debugId}:`, ...args)
        }

        // TEMPLATE -------------------------------------------
        // 🔴 currently unused, should probably add css bg classes similar to hover: in DovAppearance
        const [hovered_, setHovered] = useState(false)
        const hovered = hovered__ ? hovered__(hovered_) : hovered_

        // ===================================================================
        const onMouseEnter = (ev: React.MouseEvent<HTMLDivElement>): void => {
            log('onMouseEnter')
            if (p.hoverable != null) setHovered(true)
            if (tooltip != null) {
                const elem = ev.currentTarget
                const depth = getDOMElementDepth(elem)
                tooltipStuff.tooltips.set(depth, {
                    depth,
                    ref: elem,
                    text: tooltip ?? 'test',
                    placement: tooltipPlacement ?? 'auto',
                })
            }
            if (onMouseEnter__) onMouseEnter__(ev)
        }

        const _onMouseOut = (ev: MouseEvent): void => {
            log('onMouseOut')
            if (p.debugId != null) console.log('🔴 ~ OUT:', p.debugId)
            if (p.hoverable != null) setHovered(false)
            if (tooltip != null) {
                const elem = ev.currentTarget
                const depth = getDOMElementDepth(elem)
                const prev = tooltipStuff.tooltips.get(depth)
                if (prev?.ref === ev.currentTarget) {
                    tooltipStuff.tooltips.delete(depth)
                }
            }
        }

        const flexProps = lookToFlexProps(p.look)
        if ((p.icon || p.suffixIcon) && p.direction == null) flexProps.direction = 'horizontal'
        if (p.row || p.line) flexProps.direction = 'horizontal'
        if (p.col) flexProps.direction = 'vertical'
        if (p.col && p.align == null) flexProps.align = 'start'

        if (gap != null) flexProps.gap = gap
        if (direction != null) flexProps.direction = direction
        if (align != null) flexProps.align = align
        if (justify != null) flexProps.justify = justify
        if (wrap != null) flexProps.wrap = wrap
        if (flex != null) flexProps.flex = flex

        const flexClassname = flexCVA(flexProps)

        const appearanceProps = lookToProps(p.look)
        if (dominant != null) appearanceProps.dominant = dominant
        if (inverted != null) appearanceProps.inverted = inverted
        if (typography != null) appearanceProps.typography = typography
        if (bordered != null) appearanceProps.bordered = bordered
        if (hoverable != null) appearanceProps.hoverable = hoverable
        if (active != null) appearanceProps.active = active
        if (disabled != null) appearanceProps.disabled = disabled

        const appearance = appearanceCVA(appearanceProps) // prettier-ignore
        const debugId = useId()

        const style_: CSSProperties = { ...style }
        if (debugColor && style?.background == null) style_.background = stableColor(debugId)

        // for typescript perf reason, let's not care about the `as` prop
        // and just pretend it's always a div. it will mostly always be.
        const Elem: 'div' = (as ?? 'div') as 'div'

        return (
            <Elem //
                ref={ref}
                // 📋 tooltip is now handled by csuite directly
                // | no need to rely on the browser's default tooltip
                // | // title={tooltip}

                // onMouseEnter={_onMouseEnter}
                onMouseOut={_onMouseOut}
                // special-case: if it's a button, let's add type=button to disable form submission
                {...(as === 'button' ? { type: 'button' } : {})}
                tw={twMerge([
                    'box',
                    size && `box-${size}`,
                    square && `box-square`,
                    loading && 'relative',
                    expand && 'flex-1',
                    // layout
                    debug && 'p-1 min-h-8 min-w-11 text-center',
                    debugColor && 'text-white font-bold border',
                    flexClassname,
                    appearance,
                    onClick && 'cursor-pointer',
                    hovered &&
                        Boolean(hoverable) &&
                        (appearanceProps.inverted === true ? 'bg-opacity-80 border-opacity-80' : 'bg-gray-100'), // 🔶 should depend on inverted
                    className,
                ])}
                style={style_}
                {...rest}
                {...(triggerOnPress != null
                    ? usePressLogic({ onMouseDown, onMouseEnter, onClick }, triggerOnPress.startingState)
                    : { onMouseDown, onMouseEnter, onClick })}
            >
                {icon && <IkonOf tw='pointer-events-none flex-none' name={icon} size={iconSize} />}
                {p.children ?? (debug && debugId)}
                {suffixIcon && <IkonOf tw='pointer-events-none' name={suffixIcon} size={iconSize} />}
                {loading && <div tw='loading loading-spinner absolute loading-sm self-center justify-self-center' />}
            </Elem>
        )
    }),
)

const stableColor = (s: string) => `hsl(${hashStringToNumber(s) % 360}, 70%, 50%)`

export const Col = observer(
    forwardRef(function Col_(p: DovProps, ref: ForwardedRef<HTMLDivElement>) {
        return <Dov ref={ref} col align='start' {...p} />
    }),
)

// 🔴 beware if you register components as clonable, you also need to forward {props.children}!
// see CellSeeMoreUI
export const Row = observer(
    forwardRef(function Col_(p: DovProps, ref: ForwardedRef<HTMLDivElement>) {
        return <Dov ref={ref} row align='center' {...p} />
    }),
)

registerComponentAsClonableWhenInsideReveal(Dov)
registerComponentAsClonableWhenInsideReveal(Col)
registerComponentAsClonableWhenInsideReveal(Row)
