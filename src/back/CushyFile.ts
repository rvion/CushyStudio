import type { Action, FormDefinition } from 'src/core/Requirement'
import type { AbsolutePath } from '../utils/fs/BrandedPaths'
import type { ServerState } from './ServerState'
import { ActionL, asActionID } from '../models/Action'

import { readFileSync } from 'fs'
import { FormBuilder } from '../controls/askv2'
import { transpileCode } from './transpiler'

export type MarkdownTestData = CushyFile | /* TestHeading |*/ ActionL

export type CodeRange = {
    fromLine: number
    fromChar: number
    toLine: number
    toChar: number
}

const formBuilder = new FormBuilder()

/** temporary hack so I can keep a shared ActionL class but still have a way to
 * retrieve the original function that is only available on the backend
 */
export const globalActionFnCache = new WeakMap<ActionL, Action<FormDefinition>>()

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
            // const actionDef = new ActionL(this, a.name, a.action)
            // this.actions.push(actionDef)
            // console.log('UPSERTING', a.name)
            const actionID = asActionID(`${this.absPath}#${a.name}`)
            const actionL = this.workspace.db.actions.upsert({
                id: actionID,
                file: this.absPath,
                name: a.name,
                form: a.action.ui?.(formBuilder),
            })
            globalActionFnCache.set(actionL, a.action)
            // .ac.upsert(actionDef.uid, actionDef)
            // this.workspace.knownActions.set(actionDef.uid, actionDef)
        }
        // this.workspace.broadCastToAllClients({ type: 'ls', actions: this.actions.map((a) => a.ref) })
    }
}

// | ❌ this approach was not so good anyway, because it was not supporting defining
// | ❌ actions within for loops
// |
// |WorkflowRe = /^action\(['"](.*)['"]/
// |extractWorkflows = () => {
// |    const lines = this.CONTENT.split('\n')
// |
// |    this.workflows = []
// |    for (let lineNo = 0; lineNo < lines.length; lineNo++) {
// |        const line = lines[lineNo]
// |        const isWorkflow = this.WorkflowRe.exec(line)
// |        if (!isWorkflow) continue
// |        logger().info(`found action "${isWorkflow?.[1]}"`)
// |        const name = bang(isWorkflow[1])
// |        const range: CodeRange = { fromLine: lineNo, fromChar: 0, toLine: lineNo, toChar: line.length }
// |        const flow = new ActionDefinition(this, range, name)
// |        this.workflows.push(flow)
// |        this.workspace.knownActions.set(flow.uid, flow)
// |        continue
// |    }
// |    const flows = this.workflows.map((i) => ({ name: i.name, id: i.uid, form: i.form }))
// |    // console.log(`  - actions: ${flows.map((i) => i.name)}`)
// |    this.workspace.broadCastToAllClients({ type: 'ls', actions: flows })
// |    // this.workspace.updateActionListDebounced()
// |}
