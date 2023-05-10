import { TextDecoder } from 'util'
import * as vscode from 'vscode'
import { FlowDefinition } from './FlowDefinition'
import { extractWorkflows } from './extractWorkflows'
import { Workspace } from './Workspace'
import { logger } from '../logger/logger'

const textDecoder = new TextDecoder('utf-8')

export type MarkdownTestData = CushyFile | /* TestHeading |*/ FlowDefinition

export const vsTestItemOriginDict = new WeakMap<vscode.TestItem, MarkdownTestData>()

let generationCounter = 0

export class CushyFile {
    vsTestItem: vscode.TestItem

    constructor(
        //
        public workspace: Workspace,
        public uri: vscode.Uri,
    ) {
        const vsTestController = workspace.vsTestController

        this.vsTestItem = vsTestController.createTestItem(
            uri.toString(), // id
            uri.path.split('/').pop()!, // label
            uri, // uri
        )
        this.vsTestItem.canResolveChildren = true
        vsTestController.items.add(this.vsTestItem)
        vsTestItemOriginDict.set(this.vsTestItem, this)
    }

    /** true once the file content has been read */
    public didResolve = false

    async updateFromDisk() {
        try {
            const content = await this.getContentFromFilesystem(this.vsTestItem.uri!) // probably could be `this.uri`
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
        this.CONTENT = content
        const controller: vscode.TestController = this.workspace.vsTestController
        const vsTestItem: vscode.TestItem = this.vsTestItem
        const ancestors = [{ item: vsTestItem, children: [] as vscode.TestItem[] }]
        const thisGeneration = generationCounter++
        this.didResolve = true

        logger().info(`analyse ${this.uri.path}`)

        // honestly a bit hard to read but hey 🤷‍♂️
        const ascend = (depth: number) => {
            while (ancestors.length > depth) {
                const finished = ancestors.pop()!
                finished.item.children.replace(finished.children)
            }
        }

        const ids: { name: string; id: string }[] = []
        extractWorkflows(content, {
            onWorkflowFound: (range: vscode.Range, workflowName: string) => {
                const parent = ancestors[ancestors.length - 1]
                const flowID = `${vsTestItem.uri}/${workflowName}`
                ids.push({ id: flowID, name: workflowName })
                const tcase = controller.createTestItem(flowID, workflowName, vsTestItem.uri)
                const cushyFlow = new FlowDefinition(flowID, this, range, workflowName, thisGeneration)
                vsTestItemOriginDict.set(tcase, cushyFlow)
                tcase.range = range
                parent.children.push(tcase)
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
