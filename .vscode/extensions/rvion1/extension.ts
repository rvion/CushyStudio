import * as vscode from 'vscode'

// @ts-ignore
import { allIcons } from '../../../src/csuite/icons/icons'

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('decorator sample is activated')

    let timeout: any /* NodeJS.Timer */ | undefined = undefined

    // OUTPUT CHANNEL ==========================================================================
    // create a new output channel
    const channel = vscode.window.createOutputChannel('cushy')

    // DECORATION TYPES ========================================================================
    // create a decorator type that we use to decorate small numbers
    const iconDecorationType = vscode.window.createTextEditorDecorationType({
        // borderWidth: '1px',
        // borderStyle: 'solid',
        // overviewRulerColor: 'blue',
        // overviewRulerLane: vscode.OverviewRulerLane.Right,
        // light: { borderColor: 'darkblue' },
        // dark: { borderColor: 'lightblue' },
        before: {
            width: '1em',
            height: '1em',
        },
    })

    // create a decorator type that we use to decorate large numbers
    const userDecorationType = vscode.window.createTextEditorDecorationType({
        cursor: 'crosshair',
        // use a themable color. See package.json for the declaration and default values.
        // backgroundColor: { id: 'myextension.largeNumberBackground' },
        before: {
            width: '21px',
            height: '21px',
        },
    })

    let activeEditor = vscode.window.activeTextEditor

    // MATCHER ========================================================================
    vscode.commands.registerCommand('myextension.rescale100To24', async (args) => {
        const editor = activeEditor
        if (editor == null) {
            channel.appendLine('rescale100To24: No active editor => aborting')
            return
        }

        const text = editor.document.getText(editor.selection)
        channel.appendLine(`rescale100To24: initial text=${text}`)

        // replace all number by themselves multiplied by 24/100
        const newText = text.replace(/(\d+)/g, (match, p1) => {
            const rescaled = (Number(p1) * 24) / 100
            return rescaled.toFixed(2)
        })
        channel.appendLine(`rescale100To24:      to text=${newText}`)

        // replace the selected text:
        vscode.window.activeTextEditor?.edit((editBuilder) => {
            editBuilder.replace(editor!.selection, newText)
        })
        vscode.window.showInformationMessage('rescale100To24: done')
    })

    // MATCHER ========================================================================
    function updateDecorations() {
        if (!activeEditor) return

        function getDecorationIcon(path: string, iconColor: string = 'white', size = 24) {
            const origin = `${size / 2} ${size / 2}`
            return [
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">`,
                `<path transform-origin="${origin}" fill="${iconColor}" d="${path}"/>`,
                `</svg>`,
            ].join('')
        }

        const text = activeEditor.document.getText()

        // match ICONS ===============================================================
        const iconDecoration: vscode.DecorationOptions[] = []
        const regEx = /[mlc]di([A-Z-a-z0-9]+)/g
        let match
        while ((match = regEx.exec(text))) {
            const iconName = match[0]

            const iconPath = (allIcons as any)[iconName]
            const uriTxt = `data:image/svg+xml,${encodeURI(getDecorationIcon(iconPath))}`
            console.log(`[🤠] uriTxt`, uriTxt)
            const startPos = activeEditor.document.positionAt(match.index)
            const endPos = activeEditor.document.positionAt(match.index + match[0].length)
            const decoration: vscode.DecorationOptions = {
                range: new vscode.Range(startPos, endPos),
                hoverMessage: 'Number **' + match[0] + '**',
                renderOptions: {
                    // prettier-ignore
                    before: {
                        // contentText: `👍<${match[0]}>`,
                        contentIconPath: vscode.Uri.parse(uriTxt),
                        // color: { id: 'myextension.largeNumberBackground' },
                        // margin: '0 0.5em',
                    },
                },
            }
            iconDecoration.push(decoration)
        }

        // match contributors ===============================================================
        const contrDecoration: vscode.DecorationOptions[] = []
        activeEditor.setDecorations(iconDecorationType, iconDecoration)

        // match ICONS
        const regEx2 = /@(globi|rvion|taha|gui|birdddev|ghusse|domi)/g
        while ((match = regEx2.exec(text))) {
            const iconName = match[0]

            const iconPath = (allIcons as any)[iconName]
            const uriTxt = `data:image/svg+xml,${encodeURI(getDecorationIcon(iconPath))}`
            console.log(`[🤠] uriTxt`, uriTxt)
            const startPos = activeEditor.document.positionAt(match.index)
            const endPos = activeEditor.document.positionAt(match.index + match[0].length)
            const uriForLocalFile = vscode.Uri.file('/Users/loco/dev/CushyStudio/.vscode/extensions/rvion1/HeartsLove21.gif')
            const decoration: vscode.DecorationOptions = {
                range: new vscode.Range(startPos, endPos),
                hoverMessage: 'Number **' + match[0] + '**',
                renderOptions: {
                    // prettier-ignore
                    before: {
                                // contentText: `👍<${match[0]}>`,
                                contentIconPath: uriForLocalFile,
                                // width: '1em',
                                // height: '1em',
                                // color: { id: 'myextension.largeNumberBackground' },
                                // margin: '0 0.5em',
                            },
                },
            }
            contrDecoration.push(decoration)
        }
        activeEditor.setDecorations(userDecorationType, contrDecoration)

        // ⏸️ activeEditor.setDecorations(userDecorationType, largeNumbers)
    }

    // UPDATE DECORATION ===============================================================
    function triggerUpdateDecorations(throttle = false) {
        if (timeout) {
            clearTimeout(timeout)
            timeout = undefined
        }
        if (throttle) timeout = setTimeout(updateDecorations, 500)
        else updateDecorations()
    }
    if (activeEditor) triggerUpdateDecorations()
    vscode.window.onDidChangeActiveTextEditor(
        (editor) => {
            activeEditor = editor
            if (editor) triggerUpdateDecorations()
        },
        null,
        context.subscriptions,
    )
    vscode.workspace.onDidChangeTextDocument(
        (event) => {
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations(true)
            }
        },
        null,
        context.subscriptions,
    )
}

// this method is called when your extension is deactivated
export function deactivate() {
    console.log('decorator sample is deactivated')
}
