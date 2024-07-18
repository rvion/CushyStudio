import { observer } from 'mobx-react-lite'

export const WidgetIndentUI = observer(function WidgetIndentUI_(p: { depth: number }) {
    const depth = p.depth
    if (depth - 1 <= 0) return null
    // TODO: better values here
    return (
        <div
            className='UI-WidgetIndent'
            style={{
                // background: 'linear-gradient(90deg, red 0%, blue 100%)',
                // marginLeft: '.5rem',
                // marginRight: '.2rem',
                display: 'flex',
                alignSelf: 'stretch',
                flexShrink: 0,
            }}
        >
            {new Array(depth - 1).fill(0).map((_, i) => (
                <div
                    key={i}
                    className='UI-WidgetIndent'
                    style={{
                        width: `${0.7}rem`,
                        // marginRight: '.2rem',
                        flexShrink: 0,
                        alignSelf: 'stretch',
                        borderRight: '1px solid oklch(from var(--KLR) calc(l + 0.1 * var(--DIR)) c h)',
                    }}
                />
            ))}
        </div>
    )
    // return (
    //     <div
    //         className='UI-WidgetIndent'
    //         style={{
    //             width: `${(depth - 1) * 1}rem`,
    //             marginRight: '.2rem',
    //             flexShrink: 0,
    //             alignSelf: 'stretch',
    //             borderRight: '1px solid oklch(from var(--KLR) calc(l + 0.2 * var(--DIR)) c h)',
    //         }}
    //     />
    // )
})
