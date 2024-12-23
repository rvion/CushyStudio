import type { AutoCompleteSelectState } from './SelectState'

import { observer } from 'mobx-react-lite'

import { csuiteConfig } from '../config/configureCsuite'

export const SelectAllNoneUI = observer(function SelectAllNoneUI_<T>(p: {
   state: AutoCompleteSelectState<T>
   className?: string
}) {
   return (
      <div tw='px-2' className={p.className}>
         <button
            tw='text-sky-700 hover:text-sky-700 hover:underline'
            type='button'
            onClick={() => {
               p.state.selectAll()
            }}
         >
            {csuiteConfig.i18n.ui.selectMany.selectAll}
         </button>{' '}
         /{' '}
         <button
            tw='text-sky-700 hover:text-sky-700 hover:underline'
            type='button'
            onClick={() => p.state.selectNone()}
         >
            {csuiteConfig.i18n.ui.selectMany.selectNone}
         </button>
      </div>
   )
})
