import { observer } from 'mobx-react-lite'

export const WidgetIndentUI = observer(function WidgetIndentUI_(p: { depth: number }) {
    const depth = p.depth
    if (depth - 1 <= 0) return null
    return (
        <div
            style={{
                height: '100%',
                width: `${(depth - 1) * 1}rem`,
                marginRight: '.2rem',
                flexShrink: 0,
                // background: 'red',
                // borderRight: '1px solid black',
            }}
        />
    )
})
