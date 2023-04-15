import * as vscode from 'vscode'
import type { Workspace } from '../core-back/Workspace'
import { loggerExt } from '../logger/LoggerBack'

export const cmd_runcurrentscript = async (
    //
    _context: vscode.ExtensionContext,
    workspace: Workspace,
) => {
    loggerExt.info('🌠', '🟢 running current script1')
    loggerExt.info('🌠', '🟢 running current script2')
    await workspace.RUN_CURRENT_FILE()
    loggerExt.info('🌠', '🟢 done')
}
