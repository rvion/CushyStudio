import type { BoxUIProps } from '../box/BoxUIProps'
import type { IconName } from '../icons/icons'
import type { TintExt } from '../kolor/Tint'
import type { RevealPlacement } from '../reveal/RevealPlacement'
import type { FrameSize } from './FrameSize'
import type { FrameAppearance } from './FrameTemplates'

import { observer } from 'mobx-react-lite'
import { type ForwardedRef, forwardRef, type MouseEvent, useContext, useState } from 'react'

import { normalizeBox } from '../box/BoxNormalized'
import { CurrentStyleCtx } from '../box/CurrentStyleCtx'
import { usePressLogic } from '../button/usePressLogic'
import { IkonOf } from '../icons/iconHelpers'
import { compileOrRetrieveClassName } from '../tinyCSS/quickClass'
import { getDOMElementDepth } from '../utils/getDOMElementDepth'
import { objectAssignTsEfficient_t_t } from '../utils/objectAssignTsEfficient'
import { computeColors, ComputedColors } from './FrameColors'
import { tooltipStuff } from './tooltip'

export type SimpleBoxShadow = {
    inset?: boolean
    x?: number
    y?: number
    blur?: number
    spread?: number
    color?: TintExt
}

export type FrameProps = {
    tooltip?: string
    tooltipPlacement?: RevealPlacement

    /** should be moved to Box props soon */
    boxShadow?: SimpleBoxShadow

    // quick layout ----------------------------------------------------
    /** quick layout feature to add `flex flex-row` */
    row?: boolean
    /** quick layout feature to add `flex flex-row items-center` */
    line?: boolean
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

    /** HIGH LEVEL THEME-DEFINED BOX STYLES */
    look?: FrameAppearance
    // ICON ------------------------------------------------------------
    icon?: Maybe<IconName>
    iconSize?: string

    suffixIcon?: Maybe<IconName>
} & BoxUIProps &
    /** Sizing and aspect ratio vocabulary */
    FrameSize

// ------------------------------------------------------------------
// quick and dirty way to configure frame to use either style or className
type FrameMode = 'CLASSNAME' | 'STYLE'
let frameMode: FrameMode = 1 - 1 === 1 ? 'STYLE' : 'CLASSNAME'
export const configureFrameEngine = (mode: FrameMode): void => {
    frameMode = mode
}
// ------------------------------------------------------------------

export const Frame = observer(
    forwardRef(function Frame_(p: FrameProps, ref: ForwardedRef<HTMLDivElement>) {
        // PROPS --------------------------------------------

        // prettier-ignore
        const {
            active, disabled,                                   // built-in state & style modifiers
            icon, iconSize, suffixIcon, loading,                // addons
            expand, square, size,                               // size

            look,                                               // style: 1/4: frame templates
            base, hover, border, text, textShadow, shadow,      // style: 2/4: frame overrides
            boxShadow,                                          // style: 3/4: css
            style, className,                                   // style: 4/4: css, className

            row, line, col,                                     // layout

            hovered: hovered__,                                 // state
            onMouseDown, onMouseEnter, onClick, triggerOnPress, // interractions
            tooltip, tooltipPlacement,

            // remaining properties
            ...rest
        } = p

        // TEMPLATE -------------------------------------------
        // const theme = useTheme().value
        const prevCtx = useContext(CurrentStyleCtx)
        const box = normalizeBox(p)
        const [hovered_, setHovered] = useState(false)
        const hovered = hovered__ ? hovered__(hovered_) : hovered_

        // 👉 2024-06-12 rvion: we should probably be able to
        // | stop here by checking against a hash of those props
        // | + prevCtx + box + look + disabled + hovered + active + boxShadow
        // 👉 2024-07-22 rvion: done
        const { variables, nextDir, KBase, nextext }: ComputedColors = computeColors(
            prevCtx,
            box,
            look,
            disabled,
            hovered,
            active,
            boxShadow,
        )

        // ===================================================================
        const _onMouseOver = (ev: MouseEvent): void => {
            // console.log(`[🤠] hover`, ev.currentTarget)
            if (p.hover != null) setHovered(true)
            if (tooltip != null) {
                const elem = ev.currentTarget
                const depth = getDOMElementDepth(elem)
                tooltipStuff.tooltips.set(depth, {
                    depth,
                    ref: elem,
                    text: tooltip ?? 'test',
                    placement: tooltipPlacement ?? 'bottom',
                })
            }
        }

        const _onMouseOut = (ev: MouseEvent): void => {
            if (p.hover != null) setHovered(false)
            if (tooltip != null) {
                const elem = ev.currentTarget
                const depth = getDOMElementDepth(elem)
                const prev = tooltipStuff.tooltips.get(depth)
                if (prev?.ref === ev.currentTarget) {
                    tooltipStuff.tooltips.delete(depth)
                }
            }
        }

        // ===================================================================
        return (
            <div //
                ref={ref}
                // 📋 tooltip is now handled by csuite directly
                // | no need to rely on the browser's default tooltip
                // | // title={tooltip}

                onMouseOver={_onMouseOver}
                onMouseOut={_onMouseOut}
                tw={[
                    'box',
                    frameMode === 'CLASSNAME' ? compileOrRetrieveClassName(variables) : undefined,
                    size && `box-${size}`,
                    square && `box-square`,
                    loading && 'relative',
                    expand && 'flex-1',
                    // layout
                    p.line && 'flex flex-row items-center',
                    p.row && 'flex flex-row',
                    p.col && 'flex flex-col',
                    className,
                ]}
                // style={{ position: 'relative' }}
                style={
                    frameMode === 'CLASSNAME' //
                        ? style
                        : objectAssignTsEfficient_t_t(style, variables)
                }
                {...rest}
                {...(triggerOnPress != null
                    ? usePressLogic({ onMouseDown, onMouseEnter, onClick }, triggerOnPress.startingState)
                    : { onMouseDown, onMouseEnter, onClick })}
            >
                <CurrentStyleCtx.Provider
                    value={{
                        dir: nextDir,
                        base: KBase,
                        text: nextext,
                    }}
                >
                    {icon && <IkonOf tw='pointer-events-none flex-none' name={icon} size={iconSize} />}
                    {p.children}
                    {suffixIcon && <IkonOf tw='pointer-events-none' name={suffixIcon} size={iconSize} />}
                    {loading && <div tw='loading loading-spinner absolute loading-sm self-center justify-self-center' />}
                </CurrentStyleCtx.Provider>
            </div>
        )
    }),
)
