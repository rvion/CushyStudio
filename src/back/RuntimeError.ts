import type { GraphL } from 'src/models/Graph'

export class InvalidPromptError extends Error {
    constructor(
        //
        public message: string,
        public graph: GraphL,
        public details: unknown,
    ) {
        super()
    }
}
