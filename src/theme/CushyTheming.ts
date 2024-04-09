import { Form } from '../controls/Form'
import { ThemeForm } from '../panels/Panel_Playground/PlaygroundScratchPad'

/** okclh parameters [lightness, chroma, hue, alpha] */
type ThemeColor = [number, number, number, number]
type oklchColor = [number, number, number, number]

type StyleShadowProps = {
    enabled: boolean
    factor: number
}

type StyleBackgroundProps = {
    enabled: boolean
    lightness: number
    chroma: number
    hue: number
    shadow: StyleShadowProps
}

type Style = {
    id: string
    background: StyleBackgroundProps
    border?: oklchColor
}

function autoContrast(lightness: number, contrast: number) {
    /* This slightly favors using the darker color by adding a small float to ensure we always have -1/1 from Math.sign */
    const start = lightness
    const end = Math.round(lightness) - Math.sign(lightness - 0.5 + 0.00001)
    return start * (1 - contrast) + end * contrast
}

export class CushyThemeManager {
    styleElement: HTMLStyleElement
    styles: Style[] = []
    public isDirty: boolean = true

    constructor() {
        this.isDirty = true
        let styleElement = document.querySelector('[title="dynamic-theme-css"]') as HTMLStyleElement

        if (styleElement) {
            this.styleElement = styleElement
        } else {
            this.styleElement = styleElement ?? document.createElement('style')
            this.styleElement.title = 'dynamic-theme-css'
            document.head.appendChild(this.styleElement)
        }

        this.styles.push({
            id: '.theme-number-field',
            background: { enabled: false, lightness: 0.5, chroma: 0.1, hue: 0, shadow: { enabled: false, factor: 0.2 } },
            border: [0, 0, 0, 1],
        })
        this.updateCSSFromForm()
    }

    ensureStyleSheet = () => {
        let styleElement = document.querySelector('[title="dynamic-theme-css"]') as HTMLStyleElement

        if (styleElement) {
            this.styleElement = styleElement
        } else {
            this.styleElement = styleElement ?? document.createElement('style')
            this.styleElement.title = 'dynamic-theme-css'
            document.head.appendChild(this.styleElement)
        }
    }

    addCSSProperty = (className: string, property: string, value: string) => {
        // Get the CSS stylesheet of the newly created style element
        // const stylesheet = this.styleElement.sheet as CSSStyleSheet
        const stylesheet = document.styleSheets[0]

        try {
            // const styleElement = document.createElement('style');
            // document.head.appendChild(styleElement);
            // const stylesheet = styleElement.sheet as CSSStyleSheet;
            if (stylesheet) {
                stylesheet.insertRule(`${className} { ${property}: ${value}; }`, stylesheet.cssRules.length)
                stylesheet.insertRule('.test {}', 0)
                console.log('[🪥] - Added rule', className, property, value)
            }
        } catch (error) {
            console.error('[🪥] Error adding CSS property:', error)
        }
    }

    removeCSSProperty = (rule: CSSStyleRule, property: string) => {
        rule.style.removeProperty(property)
    }

    ensureRule = (selector: string): CSSStyleRule => {
        const styleSheet = this.styleElement.sheet as CSSStyleSheet

        const rules = styleSheet.cssRules || styleSheet.rules
        if (rules) {
            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j] as CSSStyleRule
                if (rule.selectorText === selector) {
                    return rule
                }
            }
        }

        const index = styleSheet.insertRule(`${selector} {}`, styleSheet.cssRules.length)
        return styleSheet.cssRules[index] as CSSStyleRule
    }

    addOrModifyCSSRule = (p: { rule?: CSSStyleRule; property: string; value: string }) => {
        const styleSheet = this.styleElement.sheet as CSSStyleSheet

        const rules = styleSheet.cssRules || styleSheet.rules
        if (p.rule) {
            console.log('[🪥] - Updating: ', p.rule, ' ', p.property, ' ', p.value)
            p.rule.style.setProperty(p.property, p.value)
            return
        }

        console.log('[🪥] - Inserting: ', p.rule, ' ', p.property, ' ', p.value)
        styleSheet.insertRule(`${p.rule} { ${p.property}: ${p.value}; }`, styleSheet.cssRules.length)
    }

    updateCSS = () => {
        /* Currently this will rebuild all CSS classes from scratch.
         * In the future we modify per CSS class name instead since we want real-time updating. */
        document.head.removeChild(this.styleElement)
        this.styleElement.remove()

        this.ensureStyleSheet()

        this.styleElement.sheet?.cssRules
        for (let style of this.styles) {
            const rule = this.ensureRule('.theme-input-number')
            console.log(rule)
            console.log('[🪥] - Ensured Rule: ', rule)
            const bg = style.background
            if (bg && bg.enabled) {
                this.addOrModifyCSSRule({
                    rule,
                    property: 'background',
                    value: `oklch(${bg.lightness} ${bg.chroma} ${bg.hue})`,
                })
                // this.addOrModifyCSSRule(style.id, '', `oklch(${bg.lightness} ${bg.chroma} ${bg.hue})`)
            } else {
                this.removeCSSProperty(rule, 'background')
            }
        }
    }

    updateCSSFromForm = () => {
        /* Currently this will rebuild all CSS classes from scratch.
         * In the future we modify per CSS class name instead since we want real-time updating. */
        document.head.removeChild(this.styleElement)
        this.styleElement.remove()

        this.ensureStyleSheet()

        const numberField = ThemeForm.value.inputNumber

        console.log('[🪥] - Updating from form!')

        const bg = numberField.background
        let rule = this.ensureRule('.theme-number-field')
        this.addOrModifyCSSRule({
            rule: rule,
            property: 'background',
            value: `oklch(${Math.min(Math.max(bg.lightness, 0.00001), 0.99999)} ${bg.chroma} ${bg.hue})`,
        })

        const border = numberField.border
        if (border.none) {
            this.removeCSSProperty(rule, 'border')
        }

        if (border.manual) {
            this.addOrModifyCSSRule({
                rule: rule,
                property: 'border',
                value: `1px solid oklch(${Math.min(Math.max(border.manual.lightness, 0.00001), 0.99999)} ${
                    border.manual.chroma
                } ${border.manual.hue})`,
            })
            // this.addOrModifyCSSRule('.theme-number-field', 'background', `oklch(${bg.lightness} ${bg.chroma} ${bg.hue})`)
            // this.addOrModifyCSSRule(style.id, '', `oklch(${bg.lightness} ${bg.chroma} ${bg.hue})`)
        }

        if (border.auto) {
            const calculated = autoContrast(bg?.lightness, border.auto.inputNumberContrast)
            this.addOrModifyCSSRule({
                rule: rule,
                property: 'border',
                value: `1px solid oklch(${calculated} ${bg?.chroma * border.auto.accentBleed} ${bg?.hue + border.auto.hueShift})`,
            })
            // if (border.auto.dark) {
            //     const calculated = bg?.lightness - 0.5
            //     this.addOrModifyCSSRule({
            //         rule: rule,
            //         property: 'border',
            //         value: `1px solid oklch(${calculated} ${bg?.chroma} ${bg?.hue})`,
            //     })
            // }
            // if (border.auto.dark) {
            //     const calculated = bg?.lightness - 0.5
            //     this.addOrModifyCSSRule({
            //         rule: rule,
            //         property: 'border',
            //         value: `1px solid oklch(${calculated} ${bg?.chroma} ${bg?.hue})`,
            //     })
            // }
        }

        rule = this.ensureRule('.theme-number-field .th-text')
        const text = numberField.text
        if (text.manual) {
        }

        if (text.auto) {
            const calculated = autoContrast(bg?.lightness, text.auto.inputNumberContrast)
            this.addOrModifyCSSRule({
                rule: rule,
                property: 'color',
                value: `oklch(${calculated} ${bg?.chroma * text.auto.accentBleed} ${bg?.hue + text.auto.hueShift})`,
            })

            if (text.auto.shadow && text.auto.shadow.opacity > 0) {
                const auto = text.auto.shadow
                this.addOrModifyCSSRule({
                    rule: rule,
                    property: '--text-shadow-color',
                    value: `oklch(${autoContrast(bg?.lightness, auto.contrast)} ${bg?.chroma * auto.chromaBleed} ${
                        bg?.hue + auto.hueOffset
                    } ${auto.opacity <= 1.0 && `/ ${auto.opacity}`})`,
                })
                this.addOrModifyCSSRule({
                    rule: rule,
                    property: 'text-shadow',
                    // value: `0px 1px 1px var(--text-shadow-color),
                    // 1px 1px 1px var(--text-shadow-color),
                    // -1px 1px 1px var(--text-shadow-color);`,
                    value: `0px 1px 1px var(--text-shadow-color),
                    1px 1px 1px var(--text-shadow-color),
                    -1px 1px 1px var(--text-shadow-color)`,
                })
            }
        }

        // this.isDirty = false
    }
    onUpdate = () => {}
}
