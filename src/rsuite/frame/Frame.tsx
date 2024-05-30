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
import type { Kolor } from '../kolor/Kolor'

import { observer } from 'mobx-react-lite'

import { IkonOf } from '../../icons/iconHelpers'
import { exhaust } from '../../utils/misc/exhaust'
import { BoxUI } from '../box/BoxUI'
import { type BoxUIProps } from '../box/BoxUIProps'
import { normalizeBoxBase } from '../box/normalizeBoxBase'
import { normalizeBoxBorder } from '../box/normalizeBoxBorder'
import { usePressLogic } from '../button/usePressLogic'
import { overrideKolor } from '../kolor/overrideKolor'
import { useTheme } from '../theme/useTheme'
import { FrameAppearance, type FrameAppearanceFlags } from './FrameAppearance'
import { getBorderContrast } from './FrameBorderContrast'
import { getChroma } from './FrameChroma'
import { type FrameSize, getClassNameForSize } from './FrameSize'

export type FrameProps = {
    // logic --------------------------------------------------
    /** TODO: */
    triggerOnPress?: boolean

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
    /** HIGH LEVEL THEME-DEFINED BOX STYLES */
    FrameAppearanceFlags &
    /** Sizing and aspect ratio vocabulary */
    FrameSize

// -----------------------------------------------------
export const Frame = observer(function Frame_(p: FrameProps) {
    const {
        icon,
        active,
        size,
        loading,
        disabled,
        // ---------------------------------------------
        look: _look_,

        // BOX stuff that need to be merged here -------
        base: _base_,
        border: _border_,
        text: _text_,
        hover: _hover_,
        shadow: _shadow_,
        textShadow: _textShadow_,

        //
        onMouseDown,
        onMouseEnter,
        onClick,
        //
        className,
        ...rest
    } = p

    const theme = useTheme().value

    const look = p.look ?? 'headless'
    const isDisabled = p.loading || p.disabled || false
    const mouseEvents = p.triggerOnPress
        ? usePressLogic({ onMouseDown, onMouseEnter, onClick })
        : { onMouseDown, onMouseEnter, onClick }

    // BACKGROUND ------------------------------------------------------
    const custBase: Kolor | null = p.base ? normalizeBoxBase(p.base) : null
    const lookBase: Kolor = {
        contrast: getBackgroundContrast(active, isDisabled, look),
        chroma: getChroma({ theme, active, appearance: look, isDisabled }),
    }
    /* 🔴 WIP TODO rvion 2024-05-30 */ const base: Kolor | undefined = lookBase // overrideKolor(lookBase, custBase)

    // BORDER -----------------------------------------------------------
    const custBorder: Kolor | null = p.border ? normalizeBoxBorder(p.border) : null
    const lookBorderContrast = getBorderContrast(look)
    const lookBorder: Kolor | null = lookBorderContrast ? { contrast: lookBorderContrast } : null
    const border: Kolor | undefined = overrideKolor(lookBorder, custBorder)

    // TEXT -----------------------------------------------------------
    const custText: Kolor | null = p.text ? normalizeBoxBorder(p.text) : null
    const lookTextContrast = isDisabled ? 0.1 : 0.9
    const lookText: Kolor | null = lookTextContrast ? { contrast: lookTextContrast } : null
    const text: Kolor | undefined = overrideKolor(lookText, custText)

    // HOVER ---------------------------------------------------------
    const custHover = p.hover
    const lookHover = look !== 'headless'
    const hover = custHover ?? lookHover

    // const boxProps: BoxProps = {
    //     base,
    //     border,
    //     hover: appearance !== 'headless',
    //     text,
    //     shadow: undefined,
    //     textShadow: undefined,
    // }

    return (
        <BoxUI
            // Box Props ----------------------------------------------------
            base={base}
            border={border}
            hover={hover}
            text={text}
            // --------------------------------------------------------------
            tabIndex={p.tabIndex ?? -1}
            className={className}
            /* do not contain the 3 mouse events handled above */
            {...rest}
            {...mouseEvents}
            tw={[
                '_Frame',
                'look-' + look,
                getClassNameForSize(p),
                p.expand && 'flex-1',
                p.look === 'headless' ? undefined : 'rounded-sm flex gap-2 items-center',
            ]}
        >
            {p.icon && <IkonOf name={p.icon} />}
            {p.children}
            {p.suffixIcon && <IkonOf name={p.suffixIcon} />}
        </BoxUI>
    )
})

function getBackgroundContrast(
    //
    active: Maybe<boolean>,
    isDisabled: boolean,
    appearance: FrameAppearance,
) {
    const disabledMult = isDisabled ? 0.2 : 1

    if (active) return 0.5 * disabledMult
    // if (isDisabled) return 0.05 * disabledMult

    if (appearance === 'headless') return 0 * disabledMult
    if (appearance === 'primary') return 0.9 * disabledMult
    if (appearance === 'secondary') return 0.9 * disabledMult
    if (appearance === 'ghost') return 0 * disabledMult
    if (appearance === 'default') return 0.1 * disabledMult
    if (appearance === 'subtle') return 0 * disabledMult
    if (appearance == null) return 0.1 * disabledMult
    exhaust(appearance)
    return 0.1 * disabledMult
}
