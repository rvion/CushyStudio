import type { STATE } from 'src/state/state'

import { exec } from 'child_process'
import { existsSync } from 'fs'
import { resolve as pathResolve } from 'pathe'

import { cwd } from 'process'
import { toastError, toastInfo } from '../misc/toasts'

const workspaceFolderPath = cwd()

/* Probably un-needed function, but this makes sure that we keep the UI non-blocking */
async function tryEditor(editor: string, filePath: string): Promise<void> {
    return new Promise((resolvePromise, rejectPromise) => {
        exec(`${editor} "${filePath}"`, (error, stdout, stderr) => {
            if (!error) {
                resolvePromise()
            } else {
                let errMsg = new Error(`Could not open file with ${editor}: ${error.message}`)
                rejectPromise(errMsg)
            }
        })
    })
}

export async function openInVSCode(st: STATE, filePathWithinWorkspace: string): Promise<void> {
    return new Promise(async (resolvePromise, rejectPromise) => {
        // Resolve and check the existence of the workspace and file paths
        const absoluteWorkspacePath = pathResolve(workspaceFolderPath)
        const absoluteFilePath = pathResolve(workspaceFolderPath, filePathWithinWorkspace)

        // ensure workspace exist
        if (!existsSync(absoluteWorkspacePath)) {
            const errMsg = `Provided path (${absoluteWorkspacePath}) for workspace do not exist.`
            toastError(errMsg)
            rejectPromise(new Error(errMsg))
            return
        }

        // ensure file exist
        if (!existsSync(absoluteFilePath)) {
            const errMsg = `Provided path (${absoluteFilePath}) for file do not exist.`
            toastError(errMsg)
            rejectPromise(new Error(errMsg))
            return
        }

        const preferredEditor = st.configFile.get('preferredTextEditor')

        /* Build list of editors by priority, inserting the user's preferred option to the front */
        let textEditors = ['code', 'codium', 'default']
        if (preferredEditor && textEditors.indexOf(preferredEditor) === -1) {
            textEditors.unshift(preferredEditor)
        }

        let foundWorkingEditor = false
        let usingVSCode = true
        /* Attempt to open in user preferred text editor, then VSCode/Codium as we support that
         *  editor the best, then use the system's default text editor. */
        for (let editor of textEditors) {
            if (['code', 'codium'].indexOf(editor) === -1) {
                /* Open the file in the default text editor */
                let command = editor

                if (command == 'default') {
                    command = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open'
                }

                /* Open with preferred editor, or default text editor */
                try {
                    let result = await tryEditor(command, absoluteFilePath)
                    usingVSCode = false
                    foundWorkingEditor = true
                    break
                } catch (err) {
                    console.log(`Could not open in ${editor}: ${err}`)
                }
            } else {
                /* Open with VSCode/Codium */
                try {
                    await tryEditor(editor, absoluteWorkspacePath)
                    await tryEditor(editor, absoluteFilePath)
                    foundWorkingEditor = true
                    break
                } catch (err) {
                    console.log(`Could not open in ${editor}: ${err}`)
                }
            }
        }

        if (foundWorkingEditor) {
            if (!usingVSCode) {
                toastInfo(
                    'You are not using VSCode/Codium, these editors are recommended as they are supported to autocomplete various things.',
                )
            }
            resolvePromise()
        } else {
            rejectPromise(new Error('Could not open file in any text editor.'))
        }
    })
}
