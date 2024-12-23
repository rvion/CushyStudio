import type { CSuiteConfig } from './CSuiteConfig'
import type { CSSProperties } from 'react'

/** those are needed standalone for visual regression testing in locomotive codebase */
export function CSuite_CSS_Variables(config: CSuiteConfig): CSSProperties {
   return {
      // @ts-expect-error 🔴
      '--KLR': config.baseStr,
      '--DIR': config.shiftDirection,
      '--roundness': '5px',
      // sizes
      '--widget-height': `${config.widgetHeight}rem`,
      '--input-height': `${config.inputHeight}rem`,
      '--inside-height': `${config.insideHeight}rem`, // TEMP
      // legacy ? change to inside ?
      '--input-icon-height': `${config.inputHeight / 1.8}rem`,
   }
}
