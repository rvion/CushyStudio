import * as vscode from 'vscode'
import type { Workspace } from '../core/Workspace'
import { logger } from '../logger/Logger'

export const cmd_runcurrentscript = async (
    //
    _context: vscode.ExtensionContext,
    workspace: Workspace,
) => {
    logger.info('🌠', '🟢 running current script1')
    logger.info('🌠', '🟢 running current script2')
    await workspace.RUN()
    logger.info('🌠', '🟢 done')
}
