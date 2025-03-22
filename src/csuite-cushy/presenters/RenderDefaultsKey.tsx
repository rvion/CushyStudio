import type { RuleEntry } from './RenderXXX'

import { observable } from 'mobx'

export const renderDefaultKey = observable({
   version: 0,
})
export const defaultRulesV2: RuleEntry[] = []
