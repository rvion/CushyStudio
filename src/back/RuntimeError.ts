import type { ComfyWorkflowL } from 'src/models/ComfyWorkflow'

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
