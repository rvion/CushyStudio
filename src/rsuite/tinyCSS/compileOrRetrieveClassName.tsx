import { createHash } from 'crypto'
import { type CSSProperties } from 'react'

const cache: Record<string, string> = {}
export const compileOrRetrieveClassName = (appearance: CSSProperties): string => {
    const vals = JSON.stringify(appearance)
    const hash = 'col-' + createHash('md5').update(vals).digest('hex')
    if (hash in cache) return cache[hash]!
    // console.log(`[🌈] `, `.${hash}`, appearance)
    const cssBlock = Object.entries(appearance)
        .map(([key, val]) => {
            // console.log(`[🌈] ---`, key, val)
            if (val == null) return ''
            return `${key}: ${val};`
        })
        .join('\n')
    setRule(`.${hash}`, cssBlock)
    cache[hash] = hash
    return hash
}
let styleElement: HTMLStyleElement | null = null
function getStyleElement(): HTMLStyleElement {
    if (styleElement != null) return styleElement
    // let styleElement = document.querySelector('[title="dynamic-theme-css"]') as HTMLStyleElement
    if (styleElement) {
        styleElement = styleElement
    } else {
        styleElement = styleElement ?? document.createElement('style')
        styleElement.title = 'dynamic-theme-css'
        document.head.appendChild(styleElement)
    }
    return styleElement!
}
function setRule(selector: string, block: string = ''): CSSStyleRule {
    const styleSheet = getStyleElement().sheet as CSSStyleSheet
    // ensure rules
    const rules = styleSheet.cssRules //  || styleSheet.rules
    if (rules == null) throw new Error('❌ no rules')
    // find or create rule
    const rule = Array.from(rules).find((r) => (r as CSSStyleRule).selectorText === selector) as CSSStyleRule | undefined
    if (rule == null) {
        const index = styleSheet.insertRule(`${selector} {${block}}`, styleSheet.cssRules.length)
        return styleSheet.cssRules[index] as CSSStyleRule
    } else {
        rule.style.cssText = block
        return rule
    }
}
