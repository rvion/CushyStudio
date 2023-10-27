import { exec } from 'child_process'
import { existsSync } from 'fs'
import { resolve as pathResolve } from 'pathe'

export async function openInVSCode(workspaceFolderPath: string, filePathWithinWorkspace: string): Promise<void> {
    return new Promise((resolvePromise, rejectPromise) => {
        // Resolve and check the existence of the workspace and file paths
        const absoluteWorkspacePath = pathResolve(workspaceFolderPath)
        const absoluteFilePath = pathResolve(workspaceFolderPath, filePathWithinWorkspace)

        if (!existsSync(absoluteWorkspacePath) || !existsSync(absoluteFilePath)) {
            rejectPromise(new Error('Provided path(s) do not exist.'))
            return
        }

        // First, open the folder in VSCode
        exec(`code "${absoluteWorkspacePath}"`, (error) => {
            if (error) {
                rejectPromise(new Error(`Error opening the workspace in VSCode: ${error.message}`))
                return
            }

            // Then, focus on the specific file within the workspace
            exec(`code -r "${absoluteFilePath}"`, (error) => {
                if (error) {
                    rejectPromise(new Error(`Error opening the file in VSCode: ${error.message}`))
                    return
                }

                resolvePromise()
            })
        })
    })
}
