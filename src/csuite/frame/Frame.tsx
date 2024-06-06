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
import { forwardRef, useContext } from 'react'

import { extractNormalizeBox } from '../box/BoxNormalized'
import { applyBoxToCtx, hashKolor } from '../box/compileBoxClassName'
import { CurrentStyleCtx } from '../box/CurrentStyleCtx'
import { usePressLogic } from '../button/usePressLogic'
import { IkonOf } from '../icons/iconHelpers'
import { applyKolorToOKLCH } from '../kolor/applyRelative'
import { compileKolorToCSSExpression } from '../kolor/compileKolorToCSSExpression'
import { formatOKLCH } from '../kolor/formatOKLCH'
import { isSameOKLCH } from '../kolor/OKLCH'
import { overrideKolor } from '../kolor/overrideKolor'
import { addRule, hasRule } from '../tinyCSS/compileOrRetrieveClassName'
import { getClassNameForSize } from './FrameSize'
import { frames } from './FrameTemplates'

export type FrameProps = {
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
    // inline?: boolean

    /** HIGH LEVEL THEME-DEFINED BOX STYLES */
    look?: FrameAppearance
    // ICON --------------------------------------------------
    icon?: Maybe<IconName>
    suffixIcon?: Maybe<IconName>
} & BoxUIProps &
    /** Sizing and aspect ratio vocabulary */
    FrameSize

export const Frame = observer(
    forwardRef(function Frame_(p: FrameProps, ref: any) {
        // PROPS --------------------------------------------
        // prettier-ignore
        const {
            active, disabled, // built-in state & style modifiers
            icon, suffixIcon, loading, // addons
            expand, square, /* inline, */ size, // size
            look, // templates
            base, hover, border, text, textShadow, shadow, // box stuff
            onMouseDown, onMouseEnter, onClick, triggerOnPress,
            style, className,
            ...rest
        } = p

        // TEMPLATE -------------------------------------------
        // const theme = useTheme().value
        const box = extractNormalizeBox(p)
        if (look != null) {
            const template = frames[look]
            if (template.base) box.base = overrideKolor(template.base, box.base)
            if (template.border) box.border = overrideKolor(template.border, box.border)
            if (template.text) box.text = overrideKolor(template.text, box.text)
        }

        // MODIFIERS ---------------------------------------------
        // 2024-06-05 I'm not quite sure having those modifiers here is a good idea
        // I originally though they were standard; but they are probably not
        const isDisabled = disabled || false
        if (isDisabled) {
            box.text = { contrast: 0.1 }
            box.base = { contrast: 0 }
            box.border = null
        }

        if (active) {
            box.border = { contrast: 0.5 }
            box.text = { contrast: 0.9 }
        }

        // CONTEXT ---------------------------------------------
        const prevCtx = useContext(CurrentStyleCtx)

        // const nextCtx = applyBoxToCtx(prevCtx, box)
        const nextBase = applyKolorToOKLCH(prevCtx.base, box.base)

        const nextBaseH = applyKolorToOKLCH(nextBase, box.hover)
        const nextLightness = nextBase.lightness
        const nextext = overrideKolor(prevCtx.text, box.text)!

        const goingTooDark = prevCtx.dir === 1 && nextLightness > 0.7
        const goingTooLight = prevCtx.dir === -1 && nextLightness < 0.45
        const nextDir = goingTooDark ? -1 : goingTooLight ? 1 : prevCtx.dir

        // STYLE ---------------------------------------------
        const variables: { [key: string]: string | number } = {}
        if (!isSameOKLCH(prevCtx.base, nextBase)) variables['--KLR'] = formatOKLCH(nextBase)
        if (!isSameOKLCH(prevCtx.baseH, nextBaseH)) variables['--KLRH'] = formatOKLCH(nextBaseH)
        if (nextDir !== prevCtx.dir) variables['--DIR'] = nextDir.toString()

        // CLASSES ---------------------------------------------
        const classes: string[] = []

        if (box.base_) {
            const clsName = 'bg' + hashKolor(box.base_, nextDir)
            const selector = `.${CSS.escape(clsName)}`
            if (!hasRule(selector)) addRule(`.${CSS.escape(clsName)}`, `background: ${compileKolorToCSSExpression('KLR', box.base_)};`) // prettier-ignore
            classes.push(clsName)
        }

        const boxText = box.text ?? prevCtx.text
        if (boxText) {
            const clsName = 'text' + hashKolor(boxText, nextDir)
            const selector = `.${CSS.escape(clsName)}`
            if (!hasRule(selector)) addRule(selector, `color: ${compileKolorToCSSExpression('KLR', boxText)};`)
            classes.push(clsName)
        }

        if (box.textShadow) {
            const clsName = 'textShadow' + hashKolor(box.textShadow, nextDir)
            const selector = `.${CSS.escape(clsName)}`
            if (!hasRule(selector)) addRule(selector, `text-shadow: 0px 0px 2px ${compileKolorToCSSExpression('KLR', box.textShadow)};`) // prettier-ignore
            classes.push(clsName)
        }

        if (box.border) {
            const clsName = 'border' + hashKolor(box.border, nextDir)
            const selector = `.${CSS.escape(clsName)}`
            if (!hasRule(selector)) addRule(selector, `border: 1px solid ${compileKolorToCSSExpression('KLR', box.border)};`) // prettier-ignore
            classes.push(clsName)
        }

        return (
            <div //
                {...rest}
                ref={ref}
                tw={[
                    //
                    'BOX',
                    look && `box-${look}`,
                    loading && 'relative',
                    getClassNameForSize(p),
                    expand && 'flex-1',
                    ...classes,
                    className,
                ]}
                style={{ ...style, ...variables }}
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
                    {icon && <IkonOf tw='pointer-events-none flex-none' name={icon} />}
                    {p.children}
                    {suffixIcon && <IkonOf tw='pointer-events-none' name={suffixIcon} />}
                    {loading && <div tw='loading loading-spinner absolute loading-sm self-center justify-self-center' />}
                </CurrentStyleCtx.Provider>
            </div>
        )
    }),
)
