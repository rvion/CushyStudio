export const TEMP = 1
// import { Form } from '../../controls/Form'
// import { CushyFormManager, FormBuilder } from '../../controls/FormBuilder'
// import { readJSON, writeJSON } from '../../state/jsonUtils'
// import { autoContrast } from './autoContrast'

// function templateContrast(p: { id: string; label?: string; f: FormBuilder }) {
//     const f = p.f
//     return f.shared(
//         p.id + '-contrast',
//         f
//             .group({
//                 items: {
//                     contrast: f.float({ step: 0.1, min: -1.0, max: 1.0, default: -1.0 }),
//                     chromaBleed: f.float({ step: 0.1, min: 0.0, max: 1.0, default: 1.0 }),
//                     hueOffset: f.int({ step: 20, min: -180, max: 180, default: 180 }),
//                     opacity: f.float({ step: 0.1, min: 0, max: 1, default: 0.2 }),
//                 },
//             })
//             .optional(true),
//     )
// }

// export const ThemeForm = CushyFormManager.fields(
//     (f) => {
//         const commonWidget = (id: string) => {
//             return f.group({
//                 label: 'Number Field',
//                 items: {
//                     display: f.group({
//                         label: '".theme-number-field"',
//                         collapsed: false,
//                         items: {
//                             display: f.float({ default: 0.5, min: 0, max: 1 }),
//                             displayAlt: f.float({
//                                 label: false,
//                                 text: 'Display Alt.',
//                                 alignLabel: false,
//                                 default: 0.5,
//                                 min: 0,
//                                 max: 1,
//                             }),
//                         },
//                     }),
//                     background: f.group({
//                         label: 'Background',
//                         border: false,
//                         items: {
//                             lightness: f.float({ step: 0.1, min: 0, max: 1 }),
//                             chroma: f.float({ step: 0.01, softMax: 0.2, min: 0, max: 1 }),
//                             hue: f.int({ step: 20, min: 0, max: 360 }),
//                         },
//                     }),
//                     // .optional(true),
//                     text: f.choice({
//                         label: 'Text',
//                         border: false,
//                         appearance: 'tab',
//                         default: 'auto',
//                         layout: 'H',
//                         items: {
//                             manual: f.column({
//                                 items: {
//                                     lightness: f.float({ step: 0.1, min: 0, max: 1 }),
//                                     chroma: f.float({ step: 0.01, softMax: 0.2, min: 0, max: 1 }),
//                                     hue: f.int({ step: 20, min: 0, max: 360 }),
//                                     shadow: templateContrast({ id, label: 'Shadow', f }),
//                                 },
//                             }),
//                             auto: f.column({
//                                 border: false,
//                                 collapsed: false,
//                                 items: {
//                                     inputNumberContrast: f.float({
//                                         label: 'Contrast',
//                                         step: 0.1,
//                                         min: -1,
//                                         max: 1,
//                                         default: 0.5,
//                                     }),
//                                     accentBleed: f.float({ min: 0, max: 1 }),
//                                     hueShift: f.int({ step: 20, min: -180, max: 180 }),
//                                     shadow: templateContrast({ id, label: 'Shadow', f: f }),
//                                 },
//                             }),
//                         },
//                     }),
//                     border: f.choice({
//                         label: 'Border',
//                         border: false,
//                         appearance: 'tab',
//                         default: 'auto',
//                         items: {
//                             none: f.column({}),
//                             manual: f.column({
//                                 items: {
//                                     lightness: f.float({ step: 0.1, min: 0, max: 1 }),
//                                     chroma: f.float({ step: 0.01, softMax: 0.2, min: 0, max: 1 }),
//                                     hue: f.int({ step: 20, min: 0, max: 360 }),
//                                 },
//                             }),
//                             auto: f.column({
//                                 border: false,
//                                 collapsed: false,
//                                 items: {
//                                     inputNumberContrast: f.float({
//                                         label: 'Contrast',
//                                         step: 0.1,
//                                         min: -1.0,
//                                         max: 1.0,
//                                         default: -0.3,
//                                     }),
//                                     accentBleed: f.float({ min: 0, max: 1 }),
//                                     hueShift: f.int({ step: 20, min: -180, max: 180 }),
//                                 },
//                             }),
//                         },
//                     }),
//                 },
//             })
//         }
//         // const oklchProps: PropDef[] = [{ id: 'lightness', type: 'float', options: { label: 'Lightness' } }]
//         // const widgetCommonProp: PropDef[] = [{ id: 'background', type: 'group', items: oklchProps, options: {} }]

//         // const props: PropDef[] = [
//         //     {
//         //         id: 'numberField',
//         //         type: 'group',
//         //         items: widgetCommonProp,
//         //         options: { label: 'Number Field' },
//         //     },
//         //     {
//         //         id: 'test_id',
//         //         type: 'float',
//         //         items: widgetCommonProp,
//         //         options: { label: (process.memoryUsage().heapTotal / 1000 / 1000).toString() },
//         //     },
//         // ]

//         // return {
//         //     test: f.fields(registerProps(props, f), {
//         //         collapsed: false,
//         //         // header(({widget}) => {
//         //         // }),
//         //         header: (p) => {
//         //             // return visualizeProp(p)
//         //             return visualizeWidget(p.widget)
//         //             // return <div className='COLLAPSE-PASSTHROUGH'>{p.widget.defaultBody()}</div>
//         //         },
//         //     }),
//         //     controls: f.group({
//         //         items: {
//         //             label: f.row({ label: 'Theme Name' }),
//         //             test: f.button({ onClick: () => {} }),
//         //         },
//         //     }),
//         //     // inputNumber: templateWidget(f, 'Number Input', floatDisplay.header()),
//         //     // boolTheme: templateWidget(f, 'Bool (CheckBox)'),
//         // }

//         return {
//             widgets: f.group({ label: 'Widget', items: { numberField: commonWidget('numberField') } }),
//         }
//     },
//     {
//         name: 'Theme Settings',
//         initialSerial: () => readJSON('settings/active_theme.json'),
//         onValueChange: () => {
//             cushy.themeManager.updateCSSFromForm()
//         },
//         onSerialChange: (form) => {
//             writeJSON('settings/active_theme.json', form.serial)
//         },
//     },
// )

// /** okclh parameters [lightness, chroma, hue, alpha] */
// type oklchColor = [number, number, number, number]

// type StyleShadowProps = {
//     enabled: boolean
//     factor: number
// }

// type StyleBackgroundProps = {
//     enabled: boolean
//     lightness: number
//     chroma: number
//     hue: number
//     shadow: StyleShadowProps
// }

// type Style = {
//     id: string
//     background: StyleBackgroundProps
//     border?: oklchColor
// }

// export class CushyThemeManager {
//     styleElement: HTMLStyleElement
//     styles: Style[] = []
//     public isDirty: boolean = true

//     constructor() {
//         this.isDirty = true
//         let styleElement = document.querySelector('[title="dynamic-theme-css"]') as HTMLStyleElement

//         if (styleElement) {
//             this.styleElement = styleElement
//         } else {
//             this.styleElement = styleElement ?? document.createElement('style')
//             this.styleElement.title = 'dynamic-theme-css'
//             document.head.appendChild(this.styleElement)
//         }

//         this.styles.push({
//             id: '.theme-number-field',
//             background: { enabled: false, lightness: 0.5, chroma: 0.1, hue: 0, shadow: { enabled: false, factor: 0.2 } },
//             border: [0, 0, 0, 1],
//         })
//         this.updateCSSFromForm()
//     }

//     ensureStyleSheet = () => {
//         let styleElement = document.querySelector('[title="dynamic-theme-css"]') as HTMLStyleElement

//         if (styleElement) {
//             this.styleElement = styleElement
//         } else {
//             this.styleElement = styleElement ?? document.createElement('style')
//             this.styleElement.title = 'dynamic-theme-css'
//             document.head.appendChild(this.styleElement)
//         }
//     }

//     addCSSProperty = (className: string, property: string, value: string) => {
//         // Get the CSS stylesheet of the newly created style element
//         // const stylesheet = this.styleElement.sheet as CSSStyleSheet
//         const stylesheet = document.styleSheets[0]

//         try {
//             // const styleElement = document.createElement('style');
//             // document.head.appendChild(styleElement);
//             // const stylesheet = styleElement.sheet as CSSStyleSheet;
//             if (stylesheet) {
//                 stylesheet.insertRule(`${className} { ${property}: ${value}; }`, stylesheet.cssRules.length)
//                 stylesheet.insertRule('.test {}', 0)
//                 console.log('[🪥] - Added rule', className, property, value)
//             }
//         } catch (error) {
//             console.error('[🪥] Error adding CSS property:', error)
//         }
//     }

//     removeCSSProperty = (rule: CSSStyleRule, property: string) => {
//         rule.style.removeProperty(property)
//     }

//     ensureRule = (selector: string): CSSStyleRule => {
//         const styleSheet = this.styleElement.sheet as CSSStyleSheet

//         const rules = styleSheet.cssRules || styleSheet.rules
//         if (rules) {
//             for (let j = 0; j < rules.length; j++) {
//                 const rule = rules[j] as CSSStyleRule
//                 if (rule.selectorText === selector) {
//                     return rule
//                 }
//             }
//         }

//         const index = styleSheet.insertRule(`${selector} {}`, styleSheet.cssRules.length)
//         return styleSheet.cssRules[index] as CSSStyleRule
//     }

//     addOrModifyCSSRule = (p: { rule?: CSSStyleRule; property: string; value: string }) => {
//         const styleSheet = this.styleElement.sheet as CSSStyleSheet

//         const rules = styleSheet.cssRules || styleSheet.rules
//         if (p.rule) {
//             console.log('[🪥] - Updating: ', p.rule, ' ', p.property, ' ', p.value)
//             p.rule.style.setProperty(p.property, p.value)
//             return
//         }

//         console.log('[🪥] - Inserting: ', p.rule, ' ', p.property, ' ', p.value)
//         styleSheet.insertRule(`${p.rule} { ${p.property}: ${p.value}; }`, styleSheet.cssRules.length)
//     }

//     updateCSS = () => {
//         /* Currently this will rebuild all CSS classes from scratch.
//          * In the future we modify per CSS class name instead since we want real-time updating. */
//         document.head.removeChild(this.styleElement)
//         this.styleElement.remove()

//         this.ensureStyleSheet()

//         this.styleElement.sheet?.cssRules
//         for (let style of this.styles) {
//             const rule = this.ensureRule('.theme-input-number')
//             console.log(rule)
//             console.log('[🪥] - Ensured Rule: ', rule)
//             const bg = style.background
//             if (bg && bg.enabled) {
//                 this.addOrModifyCSSRule({
//                     rule,
//                     property: 'background',
//                     value: `oklch(${bg.lightness} ${bg.chroma} ${bg.hue})`,
//                 })
//                 // this.addOrModifyCSSRule(style.id, '', `oklch(${bg.lightness} ${bg.chroma} ${bg.hue})`)
//             } else {
//                 this.removeCSSProperty(rule, 'background')
//             }
//         }
//     }

//     updateWidget = () => {}

//     updateCSSFromForm = () => {
//         /* Currently this will rebuild all CSS classes from scratch.
//          * In the future we modify per CSS class name instead since we want real-time updating. */
//         document.head.removeChild(this.styleElement)
//         this.styleElement.remove()

//         this.ensureStyleSheet()

//         const numberField = ThemeForm.value.widgets.numberField
//         console.log('[🪥] - Updating from form!')
//         const bg = numberField.background
//         let rule = this.ensureRule('.theme-number-field')
//         this.addOrModifyCSSRule({
//             rule: rule,
//             property: 'background',
//             value: `oklch(${Math.min(Math.max(bg.lightness, 0.00001), 0.99999)} ${bg.chroma} ${bg.hue})`,
//         })

//         const border = numberField.border
//         if (border.none) {
//             this.removeCSSProperty(rule, 'border')
//         }

//         if (border.manual) {
//             this.addOrModifyCSSRule({
//                 rule: rule,
//                 property: 'border',
//                 value: `1px solid oklch(${Math.min(Math.max(border.manual.lightness, 0.00001), 0.99999)} ${
//                     border.manual.chroma
//                 } ${border.manual.hue})`,
//             })
//         }

//         if (border.auto) {
//             const calculated = autoContrast(bg?.lightness, border.auto.inputNumberContrast)
//             this.addOrModifyCSSRule({
//                 rule: rule,
//                 property: 'border',
//                 value: `1px solid oklch(${calculated} ${bg?.chroma * border.auto.accentBleed} ${bg?.hue + border.auto.hueShift})`,
//             })
//         }

//         rule = this.ensureRule('.theme-number-field .th-text')
//         const text = numberField.text
//         if (text.manual) {
//         }

//         if (text.auto) {
//             const calculated = autoContrast(bg?.lightness, text.auto.inputNumberContrast)
//             this.addOrModifyCSSRule({
//                 rule: rule,
//                 property: 'color',
//                 value: `oklch(${calculated} ${bg?.chroma * text.auto.accentBleed} ${bg?.hue + text.auto.hueShift})`,
//             })

//             if (text.auto.shadow && text.auto.shadow.opacity > 0) {
//                 const auto = text.auto.shadow
//                 this.addOrModifyCSSRule({
//                     rule: rule,
//                     property: '--text-shadow-color',
//                     value: `oklch(${autoContrast(bg?.lightness, auto.contrast)} ${bg?.chroma * auto.chromaBleed} ${
//                         bg?.hue + auto.hueOffset
//                     } ${auto.opacity <= 1.0 && `/ ${auto.opacity}`})`,
//                 })
//                 this.addOrModifyCSSRule({
//                     rule: rule,
//                     property: 'text-shadow',
//                     value: `0px 1px 1px var(--text-shadow-color),
//                     1px 1px 1px var(--text-shadow-color),
//                     -1px 1px 1px var(--text-shadow-color)`,
//                 })
//             }
//         }

//         // this.isDirty = false
//     }
//     onUpdate = () => {}
// }
