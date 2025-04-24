import type { LibraryFile } from '../../cards/LibraryFile'

import { objectEntries } from '../../csuite/utils/getEntries.utils'

export const ScriptWarningsUI = obs(function ScriptWarningsUI_({ file, ...rest }: { file: LibraryFile }) {
   const warningEntries = objectEntries(file.strategyStatus)
   return (
      <div tw='_MD'>
         {/* warnings */}
         {warningEntries.length ? (
            <uy.message.Error title='Loading Strategies'>
               <ul {...rest}>
                  {warningEntries.map(([k, v]) => (
                     <li key={k}>
                        {k}: {JSON.stringify(v)}
                     </li>
                  ))}
               </ul>
            </uy.message.Error>
         ) : null}
         {/* errors */}
         {file.errors.length > 0 ? (
            <uy.message.Error title='Script Errors'>
               <ul>
                  {file.errors.map((v, i) => (
                     <li key={i}>
                        ❌ {v.title}
                        <br />
                        <pre>{v.body}</pre>{' '}
                     </li>
                  ))}
               </ul>
            </uy.message.Error>
         ) : null}
      </div>
   )
})
