import type { CSuiteConfig } from './CSuiteConfig'

import { useContext } from 'react'

import { CSuiteCtx } from './CSuiteCtx'

export const useCSuite = (): CSuiteConfig => useContext(CSuiteCtx)
