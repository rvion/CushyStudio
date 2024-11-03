import type { CushySchemaBuilder } from '../../../controls/Builder'

import { type Builder, Channel } from '../../../csuite'
import { simpleRect$, type SimpleRect$ } from '../../../csuite/fields/core-prefabs/RectSchema'
import { simpleBuilder } from '../../../csuite/SimpleFactory'
import { usePanel } from '../../../router/usePanel'
import { layer$, type Layer$ } from './Layer$'
import { mask$, type Mask$, type Masks$ } from './Masks$'

export const useUCV2 = (): UC2$['$Field'] => usePanel().usePersistentModel('StateV2', (b) => uc2$(b))

export const masksChannel: Channel<Masks$['$Field']> = new Channel()

// #region UC2
/**
 * this is the schema for the UC file format
 * basically, the definition of the structure of the content
 * of a .psd, or .xslx, .krita, ...
 */
export type UC2$ = X.XGroup<{
   fileName: X.XString
   frame: SimpleRect$
   masks: X.XList<Mask$>
   layers: X.XList<Layer$>
}>

export const uc2$ = (b: CushySchemaBuilder): UC2$ =>
   b.fields({
      fileName: b.string(),
      frame: simpleRect$({ width: 1024, height: 1024 }),
      masks: mask$(b).list().publishSelf(masksChannel),
      layers: layer$(b).list(),
   })
