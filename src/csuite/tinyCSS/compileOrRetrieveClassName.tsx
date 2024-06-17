/** quick alias */
type Selector = string // ".foo", or "div.bar:hover"

/** set of all selector already defined */
const knownRules: Set<Selector> = new Set()

/** return true when rule has already been defined for given selector */
export const hasRule = (selector: Selector): boolean => knownRules.has(selector)

export function addRule(selector: string, block: string = ''): CSSStyleRule {
    const styleSheet = getStyleElement().sheet as CSSStyleSheet
    const rules = styleSheet.cssRules
    if (rules == null) throw new Error('❌ no rules')

    // quick and dirty console log to make sure we don't over create css rules
    if (knownRules.size > 0 && knownRules.size % 100 === 0)
        console.log(`[🏛️] ${knownRules.size}th rule added`, selector, knownRules.has(selector))

    knownRules.add(selector)

    // create rule
    const index = styleSheet.insertRule(`${selector} {${block}}`, styleSheet.cssRules.length)
    return styleSheet.cssRules[index] as CSSStyleRule
}

// ⏸️ export function upsertRule(selector: string, block: string = ''): CSSStyleRule {
// ⏸️     const styleSheet = getStyleElement().sheet as CSSStyleSheet
// ⏸️     const rules = styleSheet.cssRules
// ⏸️     if (rules == null) throw new Error('❌ no rules')
// ⏸️     console.log(`[🏛️] upsert rule`, selector)
// ⏸️
// ⏸️     // upsert rule
// ⏸️     const rule = Array.from(rules).find((r) => (r as CSSStyleRule).selectorText === selector) as CSSStyleRule | undefined
// ⏸️     if (rule == null) {
// ⏸️         knownRules.add(selector)
// ⏸️         const index = styleSheet.insertRule(`${selector} {${block}}`, styleSheet.cssRules.length)
// ⏸️         return styleSheet.cssRules[index] as CSSStyleRule
// ⏸️     } else {
// ⏸️         rule.style.cssText = block
// ⏸️         return rule
// ⏸️     }
// ⏸️ }

let _styleElement: HTMLStyleElement | null = null
function getStyleElement(): HTMLStyleElement {
    if (_styleElement != null) return _styleElement
    // let styleElement = document.querySelector('[title="dynamic-theme-css"]') as HTMLStyleElement
    if (_styleElement) {
        _styleElement = _styleElement
    } else {
        _styleElement = _styleElement ?? document.createElement('style')
        _styleElement.title = 'dynamic-theme-css'
        document.head.appendChild(_styleElement)
    }
    return _styleElement!
}
