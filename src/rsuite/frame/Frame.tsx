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
import type { BoxUIProps } from '../box/BoxUIProps'
import type { FrameSize } from './FrameSize'

import { observer } from 'mobx-react-lite'
import { forwardRef, useContext } from 'react'

import { IkonOf } from '../../icons/iconHelpers'
import { extractNormalizeBox } from '../box/BoxNormalized'
import { applyBoxToCtx, compileKolorToCSSExpression, hashKolor } from '../box/compileBoxClassName'
import { CurrentStyleCtx } from '../box/CurrentStyleCtx'
import { formatOKLCH } from '../box/useColor'
import { usePressLogic } from '../button/usePressLogic'
import { overrideKolor } from '../kolor/overrideKolor'
import { setRule } from '../tinyCSS/compileOrRetrieveClassName'
import { getClassNameForSize } from './FrameSize'
import { type FrameAppearance, frames } from './FrameTemplates'

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

    /** HIGH LEVEL THEME-DEFINED BOX STYLES */
    look?: FrameAppearance
    // ICON --------------------------------------------------
    icon?: Maybe<IconName>
    suffixIcon?: Maybe<IconName>
} & BoxUIProps &
    /** Sizing and aspect ratio vocabulary */
    FrameSize

const seen = new Set<string>()
export const Frame = observer(
    forwardRef(function Frame_(p: FrameProps, ref: any) {
        // PROPS --------------------------------------------
        // prettier-ignore
        const {
            active, disabled, // built-in state & style modifiers
            icon, suffixIcon, loading, // addons
            expand, size, // size
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
            if (template.text) box.border = overrideKolor(template.text, box.text)
        }

        // MODIFIERS ---------------------------------------------
        const isDisabled = disabled || false
        if (isDisabled) {
            box.text = { contrast: 0.1 }
            box.border = null
        }
        if (active) {
            box.border = { contrast: 0.5 }
            box.text = { contrast: 0.9 }
        }

        // CONTEXT ---------------------------------------------
        const prevCtx = useContext(CurrentStyleCtx)
        const nextCtx = applyBoxToCtx(prevCtx, box)

        // STYLE ---------------------------------------------
        const variables: { [key: string]: string | number } = {
            '--DIR': nextCtx.dir?.toString(), // === -1 ? -1 : 1,
            '--BASEOK': formatOKLCH(nextCtx.base),
            // '--PREV_BASE_L': prevCtx.base.lightness, // === -1 ? -1 : 1,
            // '--NEXT_BASE_L': nextCtx.base.lightness, // === -1 ? -1 : 1,
        }

        // CLASSES ---------------------------------------------
        const classes: string[] = []

        // ⏸️ if (box.base) {
        // ⏸️     const clsName = hashKolor(box.base)
        // ⏸️     if (!seen.has(clsName)) setRule(`.${CSS.escape(clsName)}`, `background: var(--BASEOK);`)
        // ⏸️     classes.push(clsName)
        // ⏸️ }

        const boxText = box.text ?? prevCtx.text
        if (boxText) {
            const clsName = 'text' + hashKolor(boxText)
            if (!seen.has(clsName))
                setRule(`.${CSS.escape(clsName)}`, `color: ${compileKolorToCSSExpression('BASEOK', boxText)};`)
            classes.push(clsName)
        }

        if (box.textShadow) {
            const clsName = 'textShadow' + hashKolor(box.textShadow)
            if (!seen.has(clsName))
                setRule(
                    `.${CSS.escape(clsName)}`,
                    `box-shadow: 4px 4px ${compileKolorToCSSExpression('BASEOK', box.textShadow)};`,
                )
            classes.push(clsName)
        }

        if (box.border) {
            const clsName = 'border' + hashKolor(box.border)
            if (!seen.has(clsName))
                setRule(`.${CSS.escape(clsName)}`, `border: 1px solid ${compileKolorToCSSExpression('BASEOK', box.border)};`)
            classes.push(clsName)
        }

        if (box.hover) {
            const clsName = 'h' + hashKolor(box.hover)
            if (!seen.has(clsName)) setRule(`.${CSS.escape(clsName)}:hover`, `background: red`)
            classes.push(clsName)
        }

        return (
            <div //
                {...rest}
                ref={ref}
                tw={[
                    //
                    'BOX',
                    look && `BOX-${look}`,
                    getClassNameForSize(p),
                    look && 'rounded-sm flex gap-2 items-center',
                    expand && 'flex-1',
                    ...classes,
                    className,
                ]}
                style={{ ...style, ...variables }}
                {...rest}
                {...(triggerOnPress
                    ? usePressLogic({ onMouseDown, onMouseEnter, onClick })
                    : { onMouseDown, onMouseEnter, onClick })}
            >
                <CurrentStyleCtx.Provider value={nextCtx}>
                    {icon && <IkonOf name={icon} />}
                    {p.children}
                    {suffixIcon && <IkonOf name={suffixIcon} />}
                    {loading && <div tw='loading loading-spinner loading-sm' />}
                </CurrentStyleCtx.Provider>
            </div>
        )
    }),
)
