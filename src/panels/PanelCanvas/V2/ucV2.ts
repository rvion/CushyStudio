import type { CushySchemaBuilder } from '../../../controls/Builder'
import type { FieldId } from '../../../csuite/model/FieldId'

import { type Builder, Channel } from '../../../csuite'
import { simpleRect$, type SimpleRect$ } from '../../../csuite/fields/core-prefabs/RectSchema'
import { simpleShape$, type SimpleShape$ } from '../../../csuite/fields/core-prefabs/ShapeSchema'
import { simpleBuilder } from '../../../csuite/SimpleFactory'
import { usePanel } from '../../../router/usePanel'

export const useUCV2 = (): UC2$['$Field'] => usePanel().usePersistentModel('StateV2', (b) => uc2$(b))

const masksChannel: Channel<Masks$['$Field']> = new Channel()

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

// #region Masks
// gayscale/opacity
export type Mask$ = X.XGroup<{
    name: X.XString
    placement: SimpleShape$
    visible: X.XBool
    image: X.XImage
}>
const mask$ = (b: CushySchemaBuilder): Mask$ =>
    b.fields({
        name: b.string(),
        placement: simpleShape$(),
        visible: b.bool(true),
        image: b.image(),
    })

export type Masks$ = X.XList<Mask$>
const masks$ = (b: CushySchemaBuilder): Masks$ => mask$(b).list()

// #region Layer
export type Layer$ = X.XGroup<{
    placement: SimpleShape$
    visible: X.XBool
    name: X.XString
    content: X.XChoices<{
        image: X.XImage
        aiGeneration: X.XGroup<{
            masks: X.XSelectMany_<FieldId>
            draftId: X.XSelectOne<{ id: DraftID; label: string }, DraftID>
            image: X.XImage
        }>
    }>
}>
const layer$ = (b: CushySchemaBuilder): Layer$ =>
    b.fields({
        placement: simpleShape$(),
        visible: b.bool(true),
        name: b.string(),
        content: b.choice({
            image: b.image(/* MediaImageL */),
            aiGeneration: b.fields({
                // when we run a aiGeneration layer,
                // - it adds more candidates (actually, those are just the step output [type=image])
                // - canvas
                //    - it' layer
                //        it's placement
                //    - should be able to access a rasterized version of the stack of layers below it
                // BUT we also need....
                //   - feathering, etc.
                // ⏸️ bridge: b.fields({
                // ⏸️     //
                // ⏸️ }),
                masks: b.selectManyDynamicStrings<FieldId>((self) => {
                    return self.consume(masksChannel)?.items.map((t) => t.id) ?? []
                }),

                //  => Bridge is just too specifc, let's leave each app include
                // it's own bridge prefab
                draftId: b.draft(/* DraftId */),
                image: b.image(),
            }),
        }),
    })

// #region Bridge
// const bridge = (b: CushySchemaBuilder) =>
//     b.fields({
//         feathering: b.size(),
//     })
