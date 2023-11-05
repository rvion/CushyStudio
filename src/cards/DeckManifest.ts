import { Type, Static } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

// DECK --------------------------------------
export type DeckManifest = {
    /** customize your action pack name */
    name: string

    /** customize your author name */
    authorName: string

    /** short summary of your action pack */
    description: string

    /** deck-relativei local path to an image in your action pack that should be used */
    relativeIconPath?: string

    /** the list of all cards exposed by this deck */
    cards?: CardManifest[]
}

// DECK --------------------------------------
export type CardManifest = {
    /** relative to the deck root */
    deckRelativeFilePath: string

    /**
     * card name;
     * defaults to the file name without extension
     * */
    name: string

    /** card image that will be displayed in the tree picker */
    illustration?: string

    /** high priority means this card will be displayed other others */
    priority?: number

    /** card style in the library */
    style?: 'A' | 'B' | 'C' | 'D'

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
    deckRelativeFilePath: Type.String(),
    name: Type.String(),
    illustration: Type.Optional(Type.String()),
    priority: Type.Optional(Type.Number()),
    style: Type.Optional(Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C'), Type.Literal('D')])),
    description: Type.Optional(Type.String()),
    categories: Type.Optional(Type.Array(Type.String())),
    customNodeRequired: Type.Optional(Type.Array(Type.String())),
    author: Type.Optional(Type.String()),
})

/* ✅ */ type _CardSchemaT = Static<typeof CardSchema>
/* ✅ */ const _a2: CardManifest = 0 as any as _CardSchemaT

const optionalString = (description: string) => Type.Optional(Type.String({ description }))
const string = (description: string) => Type.String({ description })
export const DeckSchema = Type.Object({
    name: string('customize your action pack name'),
    authorName: string('customize your author name'),
    description: string('short summary of your action pack'),
    relativeIconPath: optionalString('local path to an image in your action pack that should be used'),
    cards: Type.Optional(Type.Array(CardSchema)),
})

export const parseDeckManifestOrCrash = (manifest: unknown): DeckManifest => {
    return Value.Decode(DeckSchema, manifest)
}

/* ✅ */ type _DeckSchemaT = Static<typeof DeckSchema>
/* ✅ */ const _a1: DeckManifest = 0 as any as _DeckSchemaT

// DECK --------------------------------------
// console.log(DeckSchema)
// console.log(JSON.stringify(DeckSchema))
