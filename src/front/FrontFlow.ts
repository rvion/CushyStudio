import type { Branded } from '../utils/types'
import { FromExtension_Print } from '../types/MessageFromExtensionToWebview'
import { nanoid } from 'nanoid'
import { FrontState } from './FrontState'

export type FlowID = Branded<string, 'FlowID'>

export const asFlowID = (s: string): FlowID => s as any

export class FrontFlow {
    constructor(
        //
        public workspace: FrontState,
        public id: FlowID = asFlowID(nanoid()),
    ) {}

    history: FromExtension_Print[] = []
}
