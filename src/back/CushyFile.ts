import type { Action, FormDefinition } from 'src/core/Requirement'
import type { AbsolutePath } from '../utils/fs/BrandedPaths'
import type { STATE } from 'src/front/state'
import type { CushyFileWatcher } from './CushyFileWatcher'

import { ToolL, asToolID } from '../models/Tool'
import { readFileSync } from 'fs'
import { FormBuilder } from '../controls/FormBuilder'
import { transpileCode } from './transpiler'
import { globalToolFnCache } from '../core/globalActionFnCache'

const formBuilder = new FormBuilder()

export class CushyFile {
    CONTENT = ''
    actions: ToolL[] = []

    constructor(public st: STATE, public absPath: AbsolutePath) {
        this.CONTENT = readFileSync(absPath, 'utf-8')
        // this.extractWorkflowsV2()
    }

    extractWorkflowsV2 = async () => {
        const codeTS = this.CONTENT
        const codeJS = await transpileCode(codeTS)

        const actionsPool: { name: string; action: Action<FormDefinition> }[] = []
        const registerActionFn = (name: string, action: Action<any>): void => {
            console.info(`[💙] TOOL: found script: "${name}" in file "${this.absPath}"`)
            actionsPool.push({ name, action })
        }
        const ProjectScriptFn = new Function('action', codeJS)
        await ProjectScriptFn(registerActionFn)

        for (const a of actionsPool) {
            const actionID = asToolID(`${this.absPath}#${a.name}`)
            const tool = this.st.db.tools.upsert({
                id: actionID,
                file: this.absPath,
                name: a.name,
                priority: a.action.priority ?? 100,
                form: a.action.ui?.(formBuilder),
                codeTS: codeTS,
                codeJS: codeJS,
            })
            globalToolFnCache.set(tool, a.action)
        }
    }
}
