import type { Workspace } from './Workspace'
import * as vscode from 'vscode'

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
        vscode.workspace.onWillSaveTextDocument(this.onWillSaveDocument)
    }

    onWillSaveDocument = (event: vscode.TextDocumentWillSaveEvent) => {
        const openEditor = vscode.window.visibleTextEditors.filter((editor) => editor.document.uri === event.document.uri)[0]
        this.decorate(openEditor)
    }

    decorate = (editor: vscode.TextEditor) => {
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
            const emojis = `[${outputs.map((i) => this.knownEmojis[i.type] ?? '❓').join('')}]`
            decorationsArray.push({
                range,
                renderOptions: {
                    before: { contentText: emojis },
                },
            })
        }

        editor.setDecorations(this.decorationType, decorationsArray)
    }
}
