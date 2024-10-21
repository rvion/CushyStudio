import type { CushySchemaBuilder } from '../../controls/Builder'
import type { TintExt } from '../kolor/Tint'

export type SimpleDropShadow = {
    x?: number
    y?: number
    blur?: number
    color?: TintExt
    opacity?: number
}

export type $schemaSimpleDropShadow = X.XGroup<{
    x: X.XNumber
    y: X.XNumber
    blur: X.XNumber
    color: X.XColor
    opacity: X.XNumber
}>

export const schemaSimpleDropShadow = (ui: CushySchemaBuilder): $schemaSimpleDropShadow =>
    ui.fields({
        x: ui.int({ default: 0, min: -20, max: 20 }),
        y: ui.int({ default: 1, min: -20, max: 20 }),
        color: ui.colorV2({ default: '#000', tooltip: 'Drop shadow color for inputs' }),
        blur: ui.int({ default: 0, min: 0, max: 20 }),
        opacity: ui.float({ default: 0.2, min: 0, max: 1, step: 0.1 }),
    })
