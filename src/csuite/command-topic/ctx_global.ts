import { CommandContext } from '../commands/Command'

export const ctx_global = new CommandContext<null>('global', () => null)
export const ctx_layout = new CommandContext<null>('layout', () => null)
export const ctx_screencast = new CommandContext<null>('screencast', () => null)
