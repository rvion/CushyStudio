import type { CushySchemaBuilder } from '../../../controls/Builder'
import type { FieldId } from '../../../csuite/model/FieldId'

import { type Builder, Channel } from '../../../csuite'
import { simpleShape$, type SimpleShape$ } from '../../../csuite/fields/board/ShapeSchema'
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
    masks: X.XList<Mask$>
    layers: X.XList<Layer$>
}>

export const uc2$ = (b: CushySchemaBuilder): UC2$ =>
    b.fields({
        fileName: b.string(),
        masks: mask$(b).list().publishSelf(masksChannel),
        layers: layer$(b).list(),
    })

// #region Placement
const placement: SimpleShape$ = simpleShape$(simpleBuilder)

// #region Masks
// gayscale/opacity
type Mask$ = X.XGroup<{
    placement: SimpleShape$
    image: X.XImage
}>
const mask$ = (b: CushySchemaBuilder): Mask$ =>
    b.fields({
        placement: placement,
        image: b.image(),
    })

type Masks$ = X.XList<
    X.XGroup<{
        placement: SimpleShape$
        image: X.XImage
    }>
>
const masks$ = (b: CushySchemaBuilder): Masks$ => mask$(b).list()

// #region Layer
type Layer$ = X.XGroup<{
    placement: SimpleShape$
    content: X.XChoices<{
        image: X.XImage
        aiGeneration: X.XGroup<{
            masks: X.XSelectMany_<FieldId>
            draftId: X.XSelectOne<{ id: DraftID; label: string }, DraftID>
            imageId: X.XImage
        }>
    }>
}>
const layer$ = (b: CushySchemaBuilder): Layer$ =>
    b.fields({
        placement: placement,
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
                imageId: b.image(),
            }),
        }),
    })

// #region Bridge
// const bridge = (b: CushySchemaBuilder) =>
//     b.fields({
//         feathering: b.size(),
//     })
