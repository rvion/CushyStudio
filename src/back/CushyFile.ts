import type { Action, FormDefinition } from 'src/core/Requirement'
import type { AbsolutePath } from '../utils/fs/BrandedPaths'
import type { ServerState } from './ServerState'
import { ActionL, asActionID } from '../models/Action'

import { readFileSync } from 'fs'
import { FormBuilder } from '../controls/askv2'
import { transpileCode } from './transpiler'
import { globalActionFnCache } from '../core/globalActionFnCache'

const formBuilder = new FormBuilder()

export class CushyFile {
    CONTENT = ''

    actions: ActionL[] = []
    constructor(
        //
        public workspace: ServerState,
        public absPath: AbsolutePath,
    ) {
        this.CONTENT = readFileSync(absPath, 'utf-8')
        this.extractWorkflowsV2()
    }

    extractWorkflowsV2 = async () => {
        const codeTS = this.CONTENT
        const codeJS = await transpileCode(codeTS)

        const actionsPool: { name: string; action: Action<FormDefinition> }[] = []
        const registerActionFn = (name: string, action: Action<any>): void => {
            console.info(`    - 🔎 ${name}`)
            actionsPool.push({ name, action })
        }
        const ProjectScriptFn = new Function('action', codeJS)
        await ProjectScriptFn(registerActionFn)

        for (const a of actionsPool) {
            const actionID = asActionID(`${this.absPath}#${a.name}`)
            const actionL = this.workspace.db.actions.upsert({
                id: actionID,
                file: this.absPath,
                name: a.name,
                form: a.action.ui?.(formBuilder),
            })
            globalActionFnCache.set(actionL, a.action)
        }
    }
}
