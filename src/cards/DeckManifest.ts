import { Type, Static } from '@sinclair/typebox'

// DECK --------------------------------------
export type DeckManifest = {
    /** customize your action pack name */
    name?: string

    /** customize your author name */
    authorName?: string

    /** short summary of your action pack */
    description?: string

    /** local path to an image in your action pack that should be used */
    icon?: string

    /** the list of all cards exposed by this deck */
    cards?: CardManifest[]
}

// DECK --------------------------------------
export type CardManifest = {
    /** relative to the deck root */
    relativePath: string

    /** action name; default to unnamed_action_<nanoid()> */
    name: string

    /** action image that will be displayed in the tree picker */
    logo?: string

    /** this description will show-up at the top of the action form */
    description?: string

    /** tags */
    categories?: string[]

    /** dependencies of your action */
    customNodeRequired?: string[]

    /** who did that? */
    author?: string

    /**
     * an example of what this card can produce
     * this may be displayed in the output Panel on first card opening
     */
    sampleOutput?: string
}

export const CardSchema = Type.Object({
    relativePath: Type.String(),
    name: Type.String(),
    logo: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    categories: Type.Optional(Type.Array(Type.String())),
    customNodeRequired: Type.Optional(Type.Array(Type.String())),
    author: Type.Optional(Type.String()),
})

/* ✅ */ type _CardSchemaT = Static<typeof CardSchema>
/* ✅ */ const _a2: CardManifest = 0 as any as _CardSchemaT

const optionalString = (description: string) => Type.Optional(Type.String({ description }))
export const DeckSchema = Type.Object({
    name: optionalString('customize your action pack name'),
    authorName: optionalString('customize your author name'),
    description: optionalString('short summary of your action pack'),
    icon: optionalString('local path to an image in your action pack that should be used'),
    cards: Type.Optional(Type.Array(CardSchema)),
})

/* ✅ */ type _DeckSchemaT = Static<typeof DeckSchema>
/* ✅ */ const _a1: DeckManifest = 0 as any as _DeckSchemaT

// DECK --------------------------------------
// console.log(DeckSchema)
// console.log(JSON.stringify(DeckSchema))
