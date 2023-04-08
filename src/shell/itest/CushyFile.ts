import { TextDecoder } from 'util'
import * as vscode from 'vscode'
import { CushyFlow } from './CushyFlow'
import { extractWorkflows } from './parser'
import { logger } from '../../logger/Logger'
// import { parseMarkdown } from './parser'

const textDecoder = new TextDecoder('utf-8')

export type MarkdownTestData = CushyFile | /* TestHeading |*/ CushyFlow

export const vsTestItemOriginDict = new WeakMap<vscode.TestItem, MarkdownTestData>()

let generationCounter = 0

export class CushyFile {
    constructor() {
        //
    }

    /** true once the file content has been read */
    public didResolve = false

    private getContentFromFilesystem = async (uri: vscode.Uri) => {
        try {
            const rawContent = await vscode.workspace.fs.readFile(uri)
            return textDecoder.decode(rawContent)
        } catch (e) {
            console.warn(`Error providing tests for ${uri.fsPath}`, e)
            return ''
        }
    }

    async updateFromDisk(
        //
        testController: vscode.TestController,
        testItem: vscode.TestItem,
    ) {
        try {
            const content = await this.getContentFromFilesystem(testItem.uri!)
            testItem.error = undefined
            this.updateFromContents(testController, content, testItem)
        } catch (e) {
            testItem.error = (e as Error).stack
        }
    }

    /**
     * Parses the tests from the input text, and updates the tests contained
     * by this file to be those from the text,
     */
    public updateFromContents(
        //
        controller: vscode.TestController,
        content: string,
        item: vscode.TestItem,
    ) {
        const ancestors = [{ item, children: [] as vscode.TestItem[] }]
        const thisGeneration = generationCounter++
        this.didResolve = true

        logger.info('🌠', 'updating from contents')

        // honestly a bit hard to read but hey 🤷‍♂️
        const ascend = (depth: number) => {
            while (ancestors.length > depth) {
                const finished = ancestors.pop()!
                finished.item.children.replace(finished.children)
            }
        }

        // const workflows = vscode
        extractWorkflows(content, {
            onTest: (range: vscode.Range, workflowName: string) => {
                const parent = ancestors[ancestors.length - 1]
                const data = new CushyFlow(this, range, workflowName, thisGeneration)
                const id = `${item.uri}/${workflowName}`

                const tcase = controller.createTestItem(id, workflowName, item.uri)
                vsTestItemOriginDict.set(tcase, data)
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

        ascend(0) // finish and assign children for all remaining items
    }
}

// export class TestHeading {
//     constructor(public generation: number) {}
// }
