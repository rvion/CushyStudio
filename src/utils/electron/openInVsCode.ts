import type { STATE } from 'src/state/state'
import { exec } from 'child_process'
import { existsSync } from 'fs'
import { resolve as pathResolve } from 'pathe'

import { cwd } from 'process'
import { toastError } from '../misc/toasts'

const workspaceFolderPath = cwd()

export async function openInVSCode(st: STATE, filePathWithinWorkspace: string): Promise<void> {
    return new Promise((resolvePromise, rejectPromise) => {
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

        const vscodeBinaryName = st.configFile.get('vscodeBinaryName') ?? 'code'
        // First, open the folder in VSCode
        exec(`${vscodeBinaryName} "${absoluteWorkspacePath}"`, (error) => {
            if (error) {
                const errMsg = `Error opening the workspace in VSCode: ${error.message}`
                toastError(errMsg)
                rejectPromise(new Error(errMsg))
                return
            }

            // Then, focus on the specific file within the workspace
            exec(`${vscodeBinaryName} -r "${absoluteFilePath}"`, (error) => {
                if (error) {
                    const errMsg = `Error opening the file in VSCode: ${error.message}`
                    toastError(errMsg)
                    rejectPromise(new Error(errMsg))
                    return
                }

                resolvePromise()
            })
        })
    })
}
