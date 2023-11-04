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

import { Type, Static } from '@sinclair/typebox'

const DeckSchema = Type.Object({
    name: Type.Optional(Type.String()),
    authorName: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    icon: Type.Optional(Type.String()),
    cards: Type.Array(Type.Any()),
})

type DeckSchemaT = Static<typeof DeckSchema>
const _a1: DeckManifest = 0 as any as DeckSchemaT

console.log(DeckSchema)
console.log(JSON.stringify(DeckSchema))
