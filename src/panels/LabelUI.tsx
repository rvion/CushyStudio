import { observer } from 'mobx-react-lite'

export const LabelUI = observer(function LabelUI_(p: { children: React.ReactNode }) {
   return <div tw='whitespace-nowrap'>{p.children}</div>
})
