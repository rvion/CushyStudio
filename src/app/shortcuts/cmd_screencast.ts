import { ctx_screencast } from '../../csuite/command-topic/ctx_global'
import { command, type Command } from '../../csuite/commands/Command'
import { Trigger } from '../../csuite/trigger/Trigger'

export const allScreencastCommands: Command<null>[] = [
   command({
      ctx: ctx_screencast,
      id: 'screencast.toogle-shortcuts-viewer',
      label: 'Toogle Shortcuts Viewer',
      combos: 'mod+4 mod+1',
      action: (): Trigger => {
         cushy.showCommandHistory = !cushy.showCommandHistory
         return Trigger.Success
      },
      icon: 'mdiKeyboard',
      validInInput: true,
   }),

   command({
      ctx: ctx_screencast,
      id: 'screencast.resize-window-for-screen-capture',
      label: 'resize CushyStudio for screen capture',
      combos: 'mod+4 mod+2',
      action: () => {
         cushy.resizeWindowForLaptop()
         return Trigger.Success
      },
      icon: 'mdiMoveResize',
      validInInput: true,
   }),
]
