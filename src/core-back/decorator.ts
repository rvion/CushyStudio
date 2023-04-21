import type { Workspace } from './Workspace'
import type { Maybe } from '../utils/types'

import * as vscode from 'vscode'
import { PossibleNodeInputAssignation, extractAllPossibleNodeInputAssignment } from './decoratorInput'
import { ComfyNodeSchema } from '../core-shared/Schema'
import { logger } from '../logger/logger'
import { extractErrorMessage } from '../utils/extractErrorMessage'

export class Decorator {
    knownEmojis: { [key: string]: string } = {
        LATENT: '🔒', // Locked padlock
        MODEL: '🧠', // Brain
        INT: '🔢', // Number
        FLOAT: '💰', // Money bag
        CONDITIONING: '🧩', // Sun behind cloud
        CLIP: '📎', // Paperclip
        VAE: '🌀', // Cyclone
        STRING: '📝', // Memo
        IMAGE: '🖼️', // Framed picture
        MASK: '🎭', // Performing arts mask
        CLIP_VISION_OUTPUT: '👀', // Eyes
        CLIP_VISION: '🎥', // Movie camera
        STYLE_MODEL: '🎨', // Artist palette
        CONTROL_NET: '🕸️', // Spider web
        DICT: '📚', // Books
        Integer: '🔢', // Number
        Float: '💰', // Money bag
        SamplerName: '🎲', // Game die
        SchedulerName: '🗓️', // Spiral calendar
        CLIPREGION: '🔳', // White square button
        SCRIPT: '📜', // Scroll
        NUMBER: '🔢', // Number
        ASCII: '🔤', // ABCD
        SEED: '🌱', // Seedling
        SAM_MODEL: '🤖', // Robot face
        SAM_PARAMETERS: '🔧', // Wrench
        IMAGE_BOUNDS: '📏', // Straight ruler
        UPSCALE_MODEL: '🔍', // Magnifying glass tilted left
    }

    decorationType = vscode.window.createTextEditorDecorationType({
        cursor: 'pointer',
    })

    constructor(public workspace: Workspace) {
        // vscode.workspace.onDidChangeTextDocument(this.decorateVisibleDocument)
        vscode.workspace.onWillSaveTextDocument(this.decorateAffectedDocument)
        // vscode.workspace.onDidOpenTextDocument(this.decorateDocument)

        // decorate every .cushy.ts document
        logger().info(`[.] decorate every .cushy.ts document...`)
        vscode.window.visibleTextEditors //
            .filter((e) => e.document.uri.path.endsWith('.cushy.ts'))
            .forEach(this.decorate)
        logger().info(`[*] decorate every .cushy.ts document 🟢`)
    }

    decorateAffectedDocument = (event: vscode.TextDocumentWillSaveEvent | vscode.TextDocumentChangeEvent) => {
        const affectedEditors = vscode.window.visibleTextEditors
            .filter((e) => e.document.uri.path.endsWith('.cushy.ts'))
            .filter((editor) => editor.document.uri === event.document.uri)
        if (affectedEditors.length === 0) return
        for (const editor of affectedEditors) this.decorate(editor)
    }

    decorateDocument = (event: vscode.TextDocument) => {
        this.decorate(vscode.window.visibleTextEditors.filter((editor) => editor.document.uri === event.uri)[0])
    }

    safely = <T>(f: () => T, def: T): T => {
        try {
            return f()
        } catch (error) {
            logger().error(extractErrorMessage(error))
            return def
        }
    }
    decorate = (editor: vscode.TextEditor) => {
        const a = this.safely(() => this.decorateA(editor), [])
        const b = this.safely(() => this.decorateB(editor), [])
        editor.setDecorations(this.decorationType, a.concat(b))
    }

    private get_emoji_B = (paramName: string, nodeName: string): Maybe<string> => {
        const node: ComfyNodeSchema = this.workspace.schema.nodesByNameInCushy[nodeName]
        if (node == null) return null //  '❓1'
        const param = node.inputs.find((p) => p.name === paramName)
        if (param == null) return null // '❓2'
        const emoji = this.knownEmojis[param.type]
        if (emoji == null) return null // '' // `❓3 ${param.type}`
        return emoji
    }

    decorateB = (editor: vscode.TextEditor): vscode.DecorationOptions[] => {
        let sourceCode = editor.document.getText()
        const candidates: PossibleNodeInputAssignation[] = extractAllPossibleNodeInputAssignment(sourceCode)
        console.log({ candidates })
        let decorationsArray: vscode.DecorationOptions[] = []
        for (const candidate of candidates) {
            const { col, row, nodeName, paramName } = candidate
            const emoji = this.get_emoji_B(paramName, nodeName)
            if (emoji == null) continue
            const range = new vscode.Range(
                //
                new vscode.Position(row, col),
                new vscode.Position(row, col + paramName.length),
            )
            decorationsArray.push({
                range,
                hoverMessage: `Input ${paramName} of node ${nodeName}`,
                renderOptions: {
                    after: { contentText: emoji },
                },
            })
        }
        return decorationsArray
    }

    decorateA = (editor: vscode.TextEditor): vscode.DecorationOptions[] => {
        let sourceCode = editor.document.getText()
        const regexStr = `[a-zA-Z_]+\\.(${this.workspace.schema.nodes.map((n) => n.nameInComfy).join('|')})\\(\\{`
        const regex = new RegExp(regexStr)
        let decorationsArray: vscode.DecorationOptions[] = []
        const sourceCodeArr = sourceCode.split('\n')

        for (let line = 0; line < sourceCodeArr.length; line++) {
            let match = sourceCodeArr[line].match(regex)

            if (match == null) continue
            if (match.index == null) continue

            const cushyNodeName: string = match[1]
            let range = new vscode.Range(
                new vscode.Position(line, match.index),
                new vscode.Position(line, match.index + match[1].length),
            )
            const outputs = this.workspace.schema.nodesByNameInCushy[cushyNodeName].outputs
            const types = outputs.map((i) => i.type)
            const emojis = outputs.map((i) => this.knownEmojis[i.type] ?? '❓').join('')
            decorationsArray.push({
                range,
                hoverMessage: types.join(','),
                renderOptions: {
                    before: { contentText: emojis },
                },
            })
        }
        return decorationsArray
        // editor.setDecorations(this.decorationType, decorationsArray)
    }
}
