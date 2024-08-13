import type { CSuiteConfig } from './CSuiteConfig'

import { createContext } from 'react'

import { CSuite_theme1 } from './CSuite_ThemeSimple'

export const CSuiteCtx = createContext<CSuiteConfig>(CSuite_theme1)
