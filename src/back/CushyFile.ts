import { TextDecoder } from 'util'
import * as vscode from 'vscode'
import { FlowDefinition } from './FlowDefinition'
import { extractWorkflows } from '../extension/extractWorkflows'
import { ServerState } from './ServerState'
import { logger } from '../logger/logger'

const textDecoder = new TextDecoder('utf-8')

export type MarkdownTestData = CushyFile | /* TestHeading |*/ FlowDefinition

export const vsTestItemOriginDict = new WeakMap<vscode.TestItem, MarkdownTestData>()

let generationCounter = 0

export class CushyFile {
    constructor(
        //
        public workspace: ServerState,
        public absPath: vscode.Uri,
    ) {}

    /** true once the file content has been read */
    public didResolve = false

    async updateFromDisk() {
        try {
            const content = this.workspace.readTextFile(this.absPath)
            this.vsTestItem.error = undefined
            this.updateFromContents(content)
        } catch (e) {
            this.vsTestItem.error = (e as Error).stack
        }
    }

    private getContentFromFilesystem = async (uri: vscode.Uri) => {
        try {
            const rawContent = await vscode.workspace.fs.readFile(uri)
            return textDecoder.decode(rawContent)
        } catch (e) {
            console.warn(`Error providing tests for ${uri.fsPath}`, e)
            return ''
        }
    }

    CONTENT = ''
    /**
     * Parses the tests from the input text, and updates the tests contained
     * by this file to be those from the text,
     */
    public updateFromContents(content: string) {
        extractWorkflows(content, {
            onWorkflowFound: (range: vscode.Range, workflowName: string) => {
                const parent = ancestors[ancestors.length - 1]
                const flowID = `${vsTestItem.uri}/${workflowName}`
                ids.push({ id: flowID, name: workflowName })
                const tcase = controller.createTestItem(flowID, workflowName, vsTestItem.uri)
                const cushyFlow = new FlowDefinition(flowID, this, range, workflowName, thisGeneration)
                // vsTestItemOriginDict.set(tcase, cushyFlow)
                // tcase.range = range
                // parent.children.push(tcase)
            },

            // onHeading: (range, name, depth) => {
            //     ascend(depth)
            //     const parent = ancestors[ancestors.length - 1]
            //     const id = `${item.uri}/${name}`

            //     const thead = controller.createTestItem(id, name, item.uri)
            //     thead.range = range
            //     testData.set(thead, new TestHeading(thisGeneration))
            //     parent.children.push(thead)
            //     ancestors.push({ item: thead, children: [] })
            // },
        })
        // logger().info('🔴' + ids.join(','))
        this.workspace.broadCastToAllClients({ type: 'ls', workflowNames: ids })

        ascend(0) // finish and assign children for all remaining items
    }
}

// export class TestHeading {
//     constructor(public generation: number) {}
// }
