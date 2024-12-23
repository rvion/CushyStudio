import { observer } from 'mobx-react-lite'

export const LegacyProgressLineUI = observer(function ProgressLine_(p: {
   //
   className?: string
   percent?: number
   status: 'success' | 'active'
}) {
   const status = p.status === 'success' ? 'progress-success' : 'progress-info'
   return (
      <progress
         //
         tw={[status, 'progress m-0', p.className]}
         value={p.percent}
         max={100}
      ></progress>
   )
})
