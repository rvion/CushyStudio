import type { Result } from '../../types/Either'

import { observer } from 'mobx-react-lite'

import { LegacyMessageUI } from '../../csuite/inputs/LegacyMessageUI'

export const ResultWrapperUI = observer(function ResultWrapperUI_<T>(p: {
   res?: Maybe<Result<T>>
   whenValid: (v: T) => React.ReactNode
}) {
   const res = p.res
   if (res == null) return <div>not available</div>
   if (res.success) return p.whenValid(res.value)
   return (
      <div>
         <LegacyMessageUI type='error'>
            <pre tw='bg-red-900'>{JSON.stringify(res.message, null, 4)}</pre>
            <pre tw='bg-red-900'>{JSON.stringify(res.error, null, 4)}</pre>
         </LegacyMessageUI>
      </div>
   )
})
