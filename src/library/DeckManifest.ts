export type DeckManifest = {
    /** customize your action pack name */
    name?: string
    /** customize your author name */
    authorName?: string
    /** short summary of your action pack */
    description?: string
    /** local path to an image in your action pack that should be used */
    icon?: string
    cards?: CardManifest[]
}

export type CardManifest = {
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
