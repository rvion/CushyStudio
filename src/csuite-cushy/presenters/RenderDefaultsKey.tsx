import type { Field } from '../../csuite/model/Field'
import type { RenderRule } from './RenderRule'

import { observable } from 'mobx'

export const renderDefaultKey = observable({
   version: 0,
})
export const defaultRulesV2: RenderRule<Field>[] = []
