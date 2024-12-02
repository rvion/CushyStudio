import type { GitManagedFolder } from './updater'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { FolderGitStatus } from '../cards/FolderGitStatus'
import { BadgeUI } from '../csuite/badge/BadgeUI'
import { Button } from '../csuite/button/Button'
import { Frame } from '../csuite/frame/Frame'
import { LegacyMessageUI } from '../csuite/inputs/LegacyMessageUI'
import { Loader } from '../csuite/inputs/Loader'
import { MessageInfoUI } from '../csuite/messages/MessageInfoUI'
import { RevealUI } from '../csuite/reveal/RevealUI'
import { exhaust } from '../csuite/utils/exhaust'
import { _formatAsRelativeDateTime } from './_getRelativeTimeString'
import { GitInstallUI } from './GitInstallUI'
import { UpdaterErrorUI } from './UpdaterErrorUI'

export const UpdateBtnUI = observer(function UpdateBtnUI_(p: {
   //
   className?: string
   updater: GitManagedFolder
   children?: ReactNode
}) {
   const updater = p.updater
   let ANCHOR = (
      <Frame
         //
         className={p.className}
         tw={['flex items-center', updater.hasUpdateAvailable && 'btn-warning']}
      >
         {p.children}
         <div tw='text-xs italic opacity-50'>
            <UpdaterAnchorUI updater={updater} />
         </div>
      </Frame>
   )
   if (updater.hasUpdateAvailable)
      ANCHOR = (
         <div tw='flex shrink-0 items-center' className={p.className}>
            {ANCHOR}
            <BadgeUI contrast={0.2} chroma={0.13} hue={0}>
               Update Available
            </BadgeUI>
         </div>
      )

   return <RevealUI content={() => <UpdaterDetailsUI updater={updater} />}>{ANCHOR}</RevealUI>
})

export const UpdaterAnchorUI = observer(function UpdaterAnchorUI_(p: { updater: GitManagedFolder }) {
   const updater = p.updater
   const status = updater.status
   if (status === FolderGitStatus.Unknown) return <Loader size='xs' />
   if (status === FolderGitStatus.DoesNotExist) return <GitInstallUI updater={updater} />
   if (status === FolderGitStatus.NotADirectory) return <div>❓ unexpected file</div>
   if (status === FolderGitStatus.FolderWithoutGit) return null // <GitInitBtnUI updater={updater} />
   if (status === FolderGitStatus.FolderWithGitButWithProblems) return <div>❓</div>
   if (status === FolderGitStatus.FolderWithGit) return updater.currentVersion
   exhaust(status)
})

export const UpdaterDetailsUI = observer(function UpdaterDetailsUI_(p: { updater: GitManagedFolder }) {
   const updater = p.updater
   const hasErrors = updater.hasErrors

   return (
      <div tw='flex flex-col gap-2 overflow-auto p-1 [max-height:80vh]'>
         {hasErrors && <LegacyMessageUI type='error'>error</LegacyMessageUI>}
         {updater.hasUpdateAvailable && (
            <MessageInfoUI>To update: close cushy and run the update script</MessageInfoUI>
         )}
         <UpdaterErrorUI updater={updater} />
         <div>
            {updater.lastFetchAt ? (
               <div>
                  <Frame line icon='mdiHistory'>
                     prev update: {_formatAsRelativeDateTime(updater.lastFetchAt)}
                  </Frame>
                  <Frame line icon='mdiPageNext'>
                     next update: {_formatAsRelativeDateTime(updater.nextFetchAt)}
                  </Frame>
               </div>
            ) : (
               <>no update done</>
            )}
         </div>
         <div tw='flex gap-2'>
            <Button look='info' size='sm' onClick={() => updater.checkForUpdatesNow()} icon='mdiRefresh'>
               REFRESH
            </Button>
         </div>
         <div>
            <table tw='table-zebra-zebra table-xs table'>
               <tbody>
                  {updater.lastLogs.logs.map((log, i) => (
                     <tr key={i}>
                        <td>{_formatAsRelativeDateTime(log.date)}</td>
                        <td tw='max-w-sm'>{log.msg}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {/* <div tw='virtualBorder flex flex-wrap items-center'>
                <span className='material-symbols-outlined'>folder</span> <div>{updater.relPath || 'root'}</div>
            </div>
            <Joined tw='flex gap-2'>
                <div className='virtualBorder'>#{p.updater.status}</div>
                <div className='virtualBorder'>action: {p.updater.currentAction ?? 'ø'}</div>
            </Joined> */}
      </div>
   )
})
