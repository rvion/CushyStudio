import type { BoxNormalized } from '../box/BoxNormalized'
import type { CurrentStyle } from '../box/CurrentStyleCtx'
import type { Kolor } from '../kolor/Kolor'
import type { SimpleBoxShadow } from './Frame'
import type { FrameAppearance } from './FrameTemplates'

import SparkMD5 from 'spark-md5'

import { overrideTint } from '../kolor/overrideTint'
import { overrideTintV2 } from '../kolor/overrideTintV2'
import { normalizeTint, type Tint } from '../kolor/Tint'
import { frameTemplates } from './FrameTemplates'

export type FrameCssVariables = {
    background?: string
    color?: string
    border?: string
    // shadow
    'box-shadow'?: string
    textShadow?: string
    '--KLR'?: string
    '--DIR'?: string
}

export type ComputedColors = {
    variables: FrameCssVariables // CSSObject
    KBase: Kolor
    nextDir: 1 | -1
    nextext: Tint
}

let totalComputeColors = 0
const colorCache = new Map<string, ComputedColors>()
export function computeColors(
    prevCtx: CurrentStyle,
    box: BoxNormalized,

    look: Maybe<FrameAppearance> = null,
    disabled: Maybe<boolean> = null,
    hovered: Maybe<boolean> = null,
    active: Maybe<boolean> = null,
    boxShadow: Maybe<SimpleBoxShadow> = null,
): ComputedColors {
    // ------------------------------------------------------------
    const strToHash = JSON.stringify({ prevCtx, box, look, disabled, hovered, active, boxShadow })
    const hash = SparkMD5.hash(strToHash)
    if (colorCache.has(hash)) return colorCache.get(hash)!
    totalComputeColors++
    if (totalComputeColors > 0 && totalComputeColors % 100 === 0) {
        console.log(`[🎨] ${totalComputeColors} / ${colorCache.size} Frame color computed !`)
    }

    // ------------------------------------------------------------
    const variables: FrameCssVariables = {}
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
    // 💬 2024-06-05 I'm not quite sure having those modifiers
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
    const prevDir = prevCtx.dir ?? (KBase.lightness > 0.5 ? -1 : 1)
    const _goingTooDark = prevDir === 1 && KBase.lightness > 0.7
    const _goingTooLight = prevDir === -1 && KBase.lightness < 0.45
    const nextDir = _goingTooDark ? -1 : _goingTooLight ? 1 : prevDir
    // 💬 2024-08-06 :
    // | in check below, we want to check
    // | against `prevCtx`.dir instead of `prevDir`, to handle the case
    // | where `prevCtx.dir` is null
    // | here       VVVVVVVVVVV
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
    // 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
    // console.log(`[🤠] box.border`, box.border)
    if (box.border) variables.border = `1px solid ${KBase.tintBorder(box.border, dir).toOKLCH()}`

    // BOX-SHADOW
    if (boxShadow) {
        const y = normalizeTint(boxShadow.color)
        variables['box-shadow'] = [
            //
            `${boxShadow.inset ? 'inset' : ''}`,
            `${boxShadow.x ?? 0}px`,
            `${boxShadow.y ?? 0}px`,
            `${boxShadow.blur ?? 0}px`,
            `${boxShadow.spread ?? 0}px`,
            `${KBase.tintBg(y).toOKLCH()}`,
        ].join(' ')
    }
    const OUT: ComputedColors = { variables, nextDir, KBase, nextext }
    colorCache.set(hash, OUT)
    return OUT
}
