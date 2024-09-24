// import type { WidgetProps } from './Renderer.types'

// import type { WidgetProps } from './Renderer.types'

// import { WidgetGroupLoco } from 'src/csuite-loco/fields/group/WidgetGroupLoco'
// import {
//    WidgetOptionalLoco,
//    WidgetOptionalLocoChild,
//    WidgetOptionalLocoParent,
// } from 'src/csuite-loco/fields/optional/WidgetOptionalLoco'
// import { WidgetSelectOne_SelectUI } from 'src/csuite-loco/fields/selectOne/WidgetSelectOne_SelectUI'
// import {
//    type CovariantFC,
//    WidgetGroup_BlockUI,
//    WidgetString_HeaderUI,
//    WidgetString_TextareaBodyUI,
// } from 'src/cushy-forms/main'

// import { WidgetChoicesLoco } from '../fields/choices/WidgetChoicesLoco'

export const widgetsCatalog = {
    group: {
        // DEFAULT: WidgetGroupLoco,
        // cushy: WidgetGroup_BlockUI,
    },
    selectOne: {
        // DEFAULT: WidgetSelectOne_SelectUI,
    },
    str: {
        // DEFAULT: WidgetString_HeaderUI,
        // normal: WidgetString_HeaderUI,
        // textarea: WidgetString_TextareaBodyUI,
    },
    optional: {
        // DEFAULT: WidgetOptionalLoco,
        // child: WidgetOptionalLocoChild,
        // managed: WidgetOptionalLocoParent,
    },
    choices: {
        // DEFAULT: WidgetChoicesLoco,
    },
    // 2024-09-18 domi: for now we use the old list widget because we need header+body and it's easier this way
    // list: {
    //    DEFAULT: WidgetList_BodyUI,
    // },
} satisfies {
    [Ty in CATALOG.AllFieldTypes]?: any // Record<string, CovariantFC<WidgetProps<any>>> // 🔴 CoveriantFC is wrong, but to be correct we would need to map Ty to the corresponding field -> annoying
}
