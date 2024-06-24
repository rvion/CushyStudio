import { observer } from 'mobx-react-lite'

export const WidgetIndentUI = observer(function WidgetIndentUI_(p: { depth: number }) {
    const depth = p.depth
    if (depth === 0) return null
    return <div style={{ width: `${depth * 0.6}rem` }}></div>
})
