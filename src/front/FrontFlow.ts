import type { FlowRunID } from 'src/back/FlowDefinition'
import { FromExtension_Print } from 'src/types/MessageFromExtensionToWebview'

export class FrontFlow {
    constructor(
        //
        public flowID: FlowRunID, // public graph: Graph,
    ) {}
    history: FromExtension_Print[] = []
}
