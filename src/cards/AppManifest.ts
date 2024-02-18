import { Static, Type } from '@sinclair/typebox'
import type { Requirements } from 'src/controls/IWidget'

export type AppMetadata = {
    /**
     * app name;
     * defaults to the file name without extension
     * */
    name?: string

    /**
     * app tags;
     * @default []
     * */
    tags?: string[]

    /** app image that will be displayed in the tree picker */
    illustration?: string

    /** high priority means this app will be displayed other others */
    priority?: number

    /** app style in the library */
    style?: 'A' | 'B' | 'C' | 'D'

    /** this description will show-up at the top of the action form */
    description?: string

    requirements?: Requirements[]
    /** help text to display (visbble by default) at the top of the draft) */
    help?: string

    /** tags */
    categories?: string[]

    /** dependencies of your action */
    customNodeRequired?: string[]

    /** who did that? */
    author?: string

    /**
     * an example of what this app can produce
     * this may be displayed in the output Panel on first app opening
     */
    sampleOutput?: string
}

export const AppMetadataSchema = Type.Object(
    {
        deckRelativeFilePath: Type.String(),
        name: Type.Optional(Type.String()),
        illustration: Type.Optional(Type.String()),
        priority: Type.Optional(Type.Number()),
        style: Type.Optional(Type.Union([Type.Literal('A'), Type.Literal('B'), Type.Literal('C'), Type.Literal('D')])),
        description: Type.Optional(Type.String()),
        categories: Type.Optional(Type.Array(Type.String())),
        customNodeRequired: Type.Optional(Type.Array(Type.String())),
        author: Type.Optional(Type.String()),
        requirements: Type.Array(Type.Any()),
    },
    { additionalProperties: false },
)

/* ✅ */ type _AppMetadataSchemaT = Static<typeof AppMetadataSchema>
/* ✅ */ const _a2: AppMetadata = 0 as any as _AppMetadataSchemaT
