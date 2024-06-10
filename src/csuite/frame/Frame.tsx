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

import type { BoxUIProps } from '../box/BoxUIProps'
import type { IconName } from '../icons/icons'
import type { FrameSize } from './FrameSize'
import type { FrameAppearance } from './FrameTemplates'

import { observer } from 'mobx-react-lite'
import { forwardRef, useContext, useState } from 'react'

import { normalizeBox } from '../box/BoxNormalized'
import { CurrentStyleCtx } from '../box/CurrentStyleCtx'
import { usePressLogic } from '../button/usePressLogic'
import { IkonOf } from '../icons/iconHelpers'
import { applyKolorToOKLCH } from '../kolor/applyRelative'
import { formatOKLCH } from '../kolor/formatOKLCH'
import { isSameOKLCH } from '../kolor/OKLCH'
import { overrideKolor } from '../kolor/overrideKolor'
import { compileOrRetrieveClassName } from '../tinyCSS/quickClass'
// import { hashKolor } from '../box/compileBoxClassName'
// import { compileKolorToCSSExpression } from '../kolor/compileKolorToCSSExpression'
// import { addRule, hasRule } from '../tinyCSS/compileOrRetrieveClassName'
import { frameTemplates } from './FrameTemplates'

export type FrameProps = {
    tooltip?: string
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
            active, disabled, // built-in state & style modifiers
            icon, iconSize, suffixIcon, loading, // addons
            expand, square, size, // size
            look, // templates
            base, hover, border, text, textShadow, shadow, // box stuff
            onMouseDown, onMouseEnter, onClick, triggerOnPress,
            style, className,
            tooltip,
            ...rest
        } = p

        // TEMPLATE -------------------------------------------
        // const theme = useTheme().value
        const box = normalizeBox(p)

        const [hovered, setHovered] = useState(false)
        let realBase = hovered ? box.hover ?? box.base : box.base

        if (look != null) {
            const template = frameTemplates[look]
            if (template.base) realBase = overrideKolor(template.base, realBase)
            if (template.border) box.border = overrideKolor(template.border, box.border)
            if (template.text) box.text = overrideKolor(template.text, box.text)
        }

        // MODIFIERS ---------------------------------------------
        // 2024-06-05 I'm not quite sure having those modifiers here is a good idea
        // I originally though they were standard; but they are probably not
        if (disabled) {
            box.text = { contrast: 0.1 }
            realBase = { contrast: 0 }
            //     box.border = null
        }

        if (active) {
            box.border = { contrast: 0.5 }
            box.text = { contrast: 0.9 }
        }

        // CONTEXT ---------------------------------------------
        const prevCtx = useContext(CurrentStyleCtx)

        // const nextCtx = applyBoxToCtx(prevCtx, box)
        const nextBase = applyKolorToOKLCH(prevCtx.base, realBase)

        const nextBaseH = applyKolorToOKLCH(nextBase, box.hover)
        const nextext = overrideKolor(prevCtx.text, box.text)!

        // next dir
        const nextLightness = nextBase.lightness
        const _goingTooDark = prevCtx.dir === 1 && nextLightness > 0.7
        const _goingTooLight = prevCtx.dir === -1 && nextLightness < 0.45
        const nextDir = _goingTooDark ? -1 : _goingTooLight ? 1 : prevCtx.dir

        // STYLE ---------------------------------------------
        const variables: { [key: string]: string | number } = {}
        if (!isSameOKLCH(prevCtx.base, nextBase)) variables['--KLR'] = formatOKLCH(nextBase)
        if (!isSameOKLCH(prevCtx.baseH, nextBaseH)) variables['--KLRH'] = formatOKLCH(nextBaseH)
        if (nextDir !== prevCtx.dir) variables['--DIR'] = nextDir.toString()

        // CLASSES ---------------------------------------------
        const classes: string[] = []

        if (box.shock) variables.background = formatOKLCH(applyKolorToOKLCH(nextBase, box.shock))
        else variables.background = formatOKLCH(nextBase)
        const boxText = box.text ?? prevCtx.text
        if (boxText) variables.color = formatOKLCH(applyKolorToOKLCH(nextBase, boxText))
        if (box.textShadow) variables.textShadow = `0px 0px 2px ${formatOKLCH(applyKolorToOKLCH(nextBase, box.textShadow))}`
        if (box.border) variables.border = `1px solid ${formatOKLCH(applyKolorToOKLCH(nextBase, box.border))}`

        let _onMouseOver: any = undefined
        let _onMouseOut: any = undefined
        if (p.hover) {
            _onMouseOver = () => setHovered(true)
            _onMouseOut = () => setHovered(false)
        }

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
                    ...classes,
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
                        base: nextBase,
                        baseH: nextBaseH,
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
