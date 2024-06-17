import type { CSuiteConfig } from './CSuiteConfig'

import { createContext } from 'react'

import { CSuite_theme1 } from './CSuite_theme1'

export const CSuiteCtx = createContext<CSuiteConfig>(CSuite_theme1)
