import type { Action, FormDefinition } from 'src/core/Requirement'
import type { AbsolutePath } from '../utils/fs/BrandedPaths'
import { ActionL, asActionID } from '../models/Action'

import { readFileSync } from 'fs'
import { FormBuilder } from '../controls/askv2'
import { transpileCode } from './transpiler'
import { globalActionFnCache } from '../core/globalActionFnCache'
import { STATE } from 'src/front/state'

const formBuilder = new FormBuilder()

export class CushyFile {
    CONTENT = ''

    actions: ActionL[] = []
    constructor(
        //
        public st: STATE,
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
            const actionL = this.st.db.actions.upsert({
                id: actionID,
                file: this.absPath,
                name: a.name,
                priority: a.action.priority ?? 100,
                form: a.action.ui?.(formBuilder),
            })
            globalActionFnCache.set(actionL, a.action)
        }
    }
}
