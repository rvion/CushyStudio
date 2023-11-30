import type { ComfyWorkflowL } from 'src/models/Graph'

export class InvalidPromptError extends Error {
    constructor(
        //
        public message: string,
        public graph: ComfyWorkflowL,
        public details: unknown,
    ) {
        super()
    }
}
