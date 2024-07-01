import { observer } from 'mobx-react-lite'

export const WidgetIndentUI = observer(function WidgetIndentUI_(p: { depth: number }) {
    const depth = p.depth
    if (depth - 1 <= 0) return null
    // TODO: better values here
    return (
        <div
            className='UI-WidgetIndent'
            style={{
                width: `${(depth - 1) * 1}rem`,
                marginRight: '.2rem',
                flexShrink: 0,
                alignSelf: 'stretch',
                borderRight: '1px solid oklch(from var(--KLR) calc(l + 0.2 * var(--DIR)) c h)',
            }}
        />
    )
})
