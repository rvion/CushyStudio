import type { CSuiteConfig } from './CSuiteConfig'

import { Kolor } from '../kolor/Kolor'

/**
 * default simple example configuration for external project
 * using cushy kit
 */

export const CSuite_theme1: CSuiteConfig = {
   tooltipDelay: 400,
   clickAndSlideMultiplicator: 1,
   showWidgetUndo: true,
   showWidgetMenu: true,
   showWidgetDiff: true,
   showFoldButtons: true,
   showToggleButtonBox: false,
   showSelectIcons: true,
   showExpandCarets: true,
   inputBorder: 8,
   inputContrast: 0.05,
   labelBackground: 5,
   labellayout: 'fixed-left',
   base: new Kolor(0.987, 0.01, 286),
   baseStr: 'oklch(0.987 0.01 286)',
   text: { contrast: 0.824 },
   labelText: { contrast: 0.48, chroma: 0.035 },
   shiftDirection: 1,
   widgetHeight: 1.8,
   inputHeight: 1.6,
   insideHeight: 1.2,
   inputRoundness: 3,
   showWidgetExtra: true,
   truncateLabels: false,
   fieldGroups: {},
}
