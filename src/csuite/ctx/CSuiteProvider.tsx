import type { CSuiteConfig } from './CSuiteConfig'

import { observer } from 'mobx-react-lite'
import { type CSSProperties, type ReactNode } from 'react'

import { Frame } from '../frame/Frame'
import { CSuite_CSS_Variables } from './CSuite_CSS_Variables'
import { CSuiteCtx } from './CSuiteCtx'

/**
 * minimalist wrapper around react context provider
 * that also inject CSS vars + set a few CSS properties to the root item
 * (color, ...)
 * */
export const CSuiteProvider = observer(function CSuiteProvider_(p: {
   children: ReactNode
   config: CSuiteConfig
   className?: string
   style?: CSSProperties
}) {
   const config = p.config
   return (
      <CSuiteCtx.Provider value={config}>
         <Frame //
            className={p.className}
            tw='h-full w-full flex-1'
            base={config.base}
            text={config.text}
            style={CSuite_CSS_Variables(config)}
         >
            {p.children}
         </Frame>
      </CSuiteCtx.Provider>
   )
})
