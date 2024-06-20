import type { BoxUIProps } from '../box/BoxUIProps'
import type { IconName } from '../icons/icons'
import type { Kolor } from '../kolor/Kolor'
import type { FrameSize } from './FrameSize'
import type { FrameAppearance } from './FrameTemplates'

import { observer } from 'mobx-react-lite'
import { forwardRef, useContext, useState } from 'react'

import { normalizeBox } from '../box/BoxNormalized'
import { CurrentStyleCtx } from '../box/CurrentStyleCtx'
import { usePressLogic } from '../button/usePressLogic'
import { IkonOf } from '../icons/iconHelpers'
import { overrideTint } from '../kolor/overrideTint'
import { overrideTintV2 } from '../kolor/overrideTintV2'
import { compileOrRetrieveClassName } from '../tinyCSS/quickClass'
import { frameTemplates } from './FrameTemplates'

export type FrameProps = {
    tooltip?: string

    /** allow to pretend the frame is hovered */
    hovered?: boolean | undefined

    // logic --------------------------------------------------
    /** TODO: */
    triggerOnPress?: { startingState: boolean }
    // STATES MODIFIERS ------------------------------------------------
    active?: Maybe<boolean>
    loading?: boolean
    disabled?: boolean

    // FITT size ----------------------------------------------------
    // /** when true flex=1 */
    expand?: boolean

    /** HIGH LEVEL THEME-DEFINED BOX STYLES */
    look?: FrameAppearance
    // ICON --------------------------------------------------
    icon?: Maybe<IconName>
    iconSize?: string

    suffixIcon?: Maybe<IconName>
} & BoxUIProps &
    /** Sizing and aspect ratio vocabulary */
    FrameSize

// ----------------------------------------------------------------------
// 2024-06-10 rvion:
// TODO:
//  ❌ we can't compile hover with the same name as non hover sadly;
//  🟢 but we can add both classes directly
//  🟢 we could also probably debounce class compilation
//  🟢 and auto-clean classes
//  🟢 and have some better caching mechanism so we don't have to normalize colors
//     nor do anything extra when the input does change

// ------------------------------------------------------------------
// quick and dirty way to configure frame to use either style or className
type FrameMode = 'CLASSNAME' | 'STYLE'
let frameMode: FrameMode = 1 - 1 === 1 ? 'STYLE' : 'CLASSNAME'
export const configureFrameEngine = (mode: FrameMode) => {
    frameMode = mode
}
// ------------------------------------------------------------------

export const Frame = observer(
    forwardRef(function Frame_(p: FrameProps, ref: any) {
        // PROPS --------------------------------------------

        // prettier-ignore
        const {
            active, disabled,                                   // built-in state & style modifiers
            icon, iconSize, suffixIcon, loading,                // addons
            expand, square, size,                               // size

            look,                                               // style: 1/3: frame templates
            base, hover, border, text, textShadow, shadow,      // style: 2/3: frame overrides
            style, className,                                   // style: 3/3: css, className

            hovered: hovered__,                                 // state
            onMouseDown, onMouseEnter, onClick, triggerOnPress, // interractions
            tooltip,

            // remaining properties
            ...rest
        } = p

        // TEMPLATE -------------------------------------------
        // const theme = useTheme().value
        const prevCtx = useContext(CurrentStyleCtx)
        const box = normalizeBox(p)
        const [hovered_, setHovered] = useState(false)
        const hovered = hovered__ ?? hovered_
        const variables: { [key: string]: string | number } = {}

        // 👉 2024-06-12 rvion: we should probably be able to
        // stop here by checking against a hash of those props
        // | + prevCtx
        // | + box
        // | + disabled
        // | + hovered
        // | + look

        const dir = prevCtx.dir
        const template = look != null ? frameTemplates[look] : undefined
        const baseTint = overrideTintV2(template?.base, box.base, disabled && { lightness: prevCtx.base.lightness })
        let KBase: Kolor = prevCtx.base.tintBg(baseTint, dir)
        if (hovered && !disabled && box.hover) {
            // console.log(`[🤠] box.hover`, box.hover, { contrast: 0.08 })
            KBase = KBase.tintBg(/* { contrast: 0.06 } */ box.hover, dir)
        }

        // ===================================================================
        // apply various overrides to `box`
        if (look != null) {
            const template = frameTemplates[look]
            // 🔶 if (template.base) realBase = overrideKolor(template.base, realBase)
            if (template.border) box.border = overrideTint(template.border, box.border)
            if (template.text) box.text = overrideTint(template.text, box.text)
        }

        // MODIFIERS
        // 2024-06-05 I'm not quite sure having those modifiers
        // here is a good idea; I originally though they were standard;
        // but they are probably not
        if (disabled) {
            box.text = { contrast: 0.1 }
        } else if (active) {
            box.border = { contrast: 0.5 }
            box.text = { contrast: 0.9 }
        }

        // ===================================================================
        // DIR
        const _goingTooDark = prevCtx.dir === 1 && KBase.lightness > 0.7
        const _goingTooLight = prevCtx.dir === -1 && KBase.lightness < 0.45
        const nextDir = _goingTooDark ? -1 : _goingTooLight ? 1 : prevCtx.dir
        if (nextDir !== prevCtx.dir) variables['--DIR'] = nextDir.toString()

        // BACKGROUND
        if (!prevCtx.base.isSame(KBase)) variables['--KLR'] = KBase.toOKLCH()
        if (box.shock) variables.background = KBase.tintBg(box.shock, dir).toOKLCH()
        else variables.background = KBase.toOKLCH()

        // TEXT
        const nextext = overrideTint(prevCtx.text, box.text)!
        const boxText = box.text ?? prevCtx.text
        if (boxText != null) variables.color = KBase.tintFg(boxText).toOKLCH()

        // TEXT-SHADOW
        if (box.textShadow) variables.textShadow = `0px 0px 2px ${KBase.tintFg(box.textShadow).toOKLCH()}`

        // BORDER
        if (box.border) variables.border = `1px solid ${KBase.tintFg(box.border).toOKLCH()}`

        // ===================================================================
        let _onMouseOver: any = undefined
        let _onMouseOut: any = undefined
        if (p.hover != null) {
            _onMouseOver = () => setHovered(true)
            _onMouseOut = () => setHovered(false)
        }

        // ===================================================================
        return (
            <div //
                ref={ref}
                title={tooltip}
                onMouseOver={_onMouseOver}
                onMouseOut={_onMouseOut}
                tw={[
                    'box',
                    frameMode === 'CLASSNAME' ? compileOrRetrieveClassName(variables) : undefined,
                    size && `box-${size}`,
                    square && `box-square`,
                    loading && 'relative',
                    expand && 'flex-1',
                    className,
                ]}
                style={frameMode === 'CLASSNAME' ? style : { ...style, ...variables }}
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
