// HIGH LEVEL THEME-DEFINED BOX STYLES
// everything is boxes,
// but lot of boxes have similar styles
// and lot of behaviours (beeing pressed, beeing active)
// need to slightly ajust those styles
// frame offer a semantic vocabulary to define look and feel of
// any surface at a higher level than the Box API.
// you can always specify BOX api directly if you need more control
// the frame will merge the low level api on top of the compiled style from
// the high level api

import type { IconName } from '../../icons/icons'
import type { RelativeStyle } from '../../theme/colorEngine/AbsoluteStyle'

import Color from 'colorjs.io'
import { type CSSProperties, ReactNode } from 'react'

import { IkonOf } from '../../icons/iconHelpers'
import { Box, type BoxProps, type BoxUIProps } from '../../theme/colorEngine/Box'
import { normalizeBase, normalizeBorder } from '../../theme/colorEngine/useColor'
import { exhaust } from '../../utils/misc/exhaust'
import { FrameAppearance, getAppearance } from './FrameAppearance'
import { type FrameSize, getClassNameForSize } from './FrameSize'
import { usePressLogic } from './usePressLogic'

export type FrameProps = {
    // logic --------------------------------------------------
    /** TODO: */
    triggerOnPress?: boolean

    // color ---------------------------------------------------
    /** 🔶 usually not needed */
    hue?: number | string
    /** 🔶 usually not needed */
    hueShift?: number | undefined

    // HIGH LEVEL THEME-DEFINED BOX STYLES -------------------------------------------
    appearance?: FrameAppearance
    /** no visual distinction; equivalent to appearance='headless' */
    headless?: boolean
    /** no border, very low contrast; equivalent to appearance='subtle' */
    subtle?: boolean
    /** small border, low contrast; equivalent to appearance='default' */
    default?: boolean
    /** a.k.a. outline: border but no contrast; equivalent to appearance='ghost' */
    ghost?: boolean
    /** for readonly stuff; equivalent to appearance='link' */
    link?: boolean
    /** panel or modal primary action; usually more chroma, more contrast; equivalent to appearance='primary' */
    primary?: boolean
    /** panel or modal secondary action; equivalent to appearance='secondary' */
    secondary?: boolean

    // STATES MODIFIERS ------------------------------------------------
    active?: Maybe<boolean>
    loading?: boolean
    disabled?: boolean

    // FITT size ----------------------------------------------------
    // /** when true flex=1 */
    expand?: boolean

    // ICON --------------------------------------------------
    icon?: Maybe<IconName>
    suffixIcon?: Maybe<IconName>
} & BoxUIProps &
    FrameSize

// -------------------------------------------------
export const Frame = (p: FrameProps) => {
    const {
        icon,
        active,
        hue,
        hueShift,
        size,
        loading,
        disabled,
        primary,
        appearance: appearance_,
        //
        onMouseDown,
        onMouseEnter,
        onClick,
        //
        className,
        ...rest
    } = p

    const appearance = getAppearance(p)
    const isDisabled = p.loading || p.disabled || false
    const chroma = getChroma({ active, appearance, isDisabled, primary })

    const hueFinal = ((): number | undefined => {
        if (p.hue == null) return
        if (typeof p.hue === 'number') return p.hue
        if (typeof p.hue === 'string') return new Color(p.hue).oklch[2]
        return
    })()

    const mouseEvents = p.triggerOnPress
        ? usePressLogic({ onMouseDown, onMouseEnter, onClick })
        : { onMouseDown, onMouseEnter, onClick }
    // -----------------------------------------------------------------
    const mergeStyles = (a: RelativeStyle | null, b: RelativeStyle | null): RelativeStyle | undefined => {
        if (a == null && b == null) return
        if (a == null) return b!
        if (b == null) return a
        return { ...a, ...b }
    }
    // BACKGROUND ------------------------------------------------------
    const normalizedBase = p.base ? normalizeBase(p.base) : null
    const themeBase: RelativeStyle = {
        contrast: getBackgroundContrast(active, isDisabled, appearance),
        chroma,
        hue: hueFinal,
        hueShift,
    }
    const base = mergeStyles(themeBase, normalizedBase)

    // BORDER -----------------------------------------------------------
    const normalziedBorder: RelativeStyle | null = p.border ? normalizeBorder(p.border) : null
    const themeBorderContrast = getBorderContrast(appearance)
    const themeBorder: RelativeStyle | null = themeBorderContrast ? { contrast: themeBorderContrast } : null
    const border = mergeStyles(themeBorder, normalziedBorder)
    return (
        <Box
            base={base}
            border={border}
            hover={appearance !== 'headless'} // TODO
            text={{ contrast: isDisabled ? 0.1 : 0.9 }}
            tabIndex={p.tabIndex ?? -1}
            className={className}
            /* do not contain the 3 mouse events handled above */
            {...rest}
            {...mouseEvents}
            tw={[
                getClassNameForSize(p),
                p.expand && 'flex-1',
                p.appearance === 'headless' ? undefined : 'rounded-sm flex gap-2 items-center',
            ]}
        >
            {p.icon && <IkonOf name={p.icon} />}
            {p.children && <div tw='line-clamp-1'>{p.children}</div>}
            {p.suffixIcon && <IkonOf name={p.suffixIcon} />}
        </Box>
    )
}

function getChroma(p: {
    //
    active: Maybe<boolean>
    isDisabled: Maybe<boolean>
    primary: Maybe<boolean>
    appearance: Maybe<FrameAppearance>
}) {
    if (p.active) return 0.1
    if (p.isDisabled) return // 0.001
    if (p.primary || p.appearance === 'primary') return 0.1
    return
    // if (appearance === 'none') return undefined
    // if (appearance === 'ghost') return 0
    // if (appearance === 'link') return 0
    // if (appearance === 'default') return 0.1
    // if (appearance === 'subtle') return 0
    // if (appearance == null) return 0.05
    // exhaust(appearance)
    // return 0.1
}

function getBorderContrast(appearance: Maybe<FrameAppearance>) {
    if (appearance === 'headless') return undefined
    if (appearance === 'primary') return 0.3
    if (appearance === 'secondary') return 0.3
    if (appearance === 'ghost') return 0
    if (appearance === 'link') return 0
    if (appearance === 'default') return 0.1
    if (appearance === 'subtle') return 0.05
    if (appearance == null) return 0.1
    exhaust(appearance)
    return 1
}

function getBackgroundContrast(
    //
    active: Maybe<boolean>,
    isDisabled: boolean,
    appearance: FrameAppearance,
) {
    if (active) return 0.6
    // if (isDisabled) return 0.05

    if (appearance === 'headless') return 0
    if (appearance === 'primary') return 0.9
    if (appearance === 'secondary') return 0.9
    if (appearance === 'ghost') return 0
    if (appearance === 'link') return 0
    if (appearance === 'default') return 0.1
    if (appearance === 'subtle') return 0
    if (appearance == null) return 0.1
    exhaust(appearance)
    return 0.1
}
