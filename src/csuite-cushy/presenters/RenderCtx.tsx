import type { Field } from '../../csuite/model/Field'
import type { Presenter } from './Renderer'

import { createContext, useContext } from 'react'

// TODO: split this module
// --------------------------------------------------------------------------------
// context for the presenter (render orchestrator, stateful per top-level <field.UI />)
export const presenterCtx = createContext<Presenter | null>(null)

export const usePresenter = (): Presenter => {
   const val = useContext(presenterCtx)
   if (val == null) throw new Error('missing presenter in react contexts')
   return val
}

export const usePresenterOrNull = (): Presenter | null => {
   return useContext(presenterCtx)
}

// --------------------------------------------------------------------------------
// context for the currently presented component.
type UIPath = [at: Field, ancesors: UIPath | null]
export const presentedCtx = createContext<UIPath | null>(null)

export const usePresented = (): UIPath => {
   const val = useContext(presentedCtx)
   if (val == null) throw new Error('missing editor in current widget react contexts')
   return val
}

export const usePresentedOrNull = (): UIPath | null => {
   return useContext(presentedCtx)
}

export const getVisualPath = (field: Field): string => {
   const visualPath = getVisualPathBase() + ` TO ${field.mountKey}`
   return visualPath
}

export const getVisualPathBase = (): string => {
   let max = 20
   const uipath = usePresented()
   let at = uipath[0]
   let ancestors = uipath[1]

   let items: string[] = []
   while (ancestors != null && max--) {
      items.push(at.mountKey)
      at = ancestors[0]
      ancestors = ancestors[1]
   }
   return items.join(' // ')
}
