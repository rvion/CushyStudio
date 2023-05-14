import type { CodeRange, CushyFile } from './CushyFile'
import type { Branded } from '../utils/types'

import { transpileCode } from './transpiler'
import { logger } from '../logger/logger'

export type ActionDefinitionID = Branded<string, 'FlowDefinitionID'>
export const asFlowDefinitionID = (s: string): ActionDefinitionID => s as any

export type ExecutionID = Branded<string, 'ExecutionID'>
export const asExecutionID = (s: string): ExecutionID => s as any

/**
 * a thin wrapper around a single (work)flow somewhere in a .cushy.ts file
 * flow = the 'WORFLOW(...)' part of a file
 * */
export class ActionDefinition {
    uid: ActionDefinitionID

    constructor(
        //
        public file: CushyFile,
        public range: CodeRange,
        public name: string,
    ) {
        this.uid = asFlowDefinitionID(`${file.absPath}#${name}`)
    }

    getCodeJS = async (): Promise<string> => {
        const codeTS = this.file.CONTENT
        const codeJS = await transpileCode(codeTS)
        if (codeJS == null) logger().info('❌ no code to run')

        // logger().info(`\`\`\`ts\n${codeJS}\n\`\`\``)
        // logger().debug('🔥', codeJS + '...')
        return codeJS
    }
}
