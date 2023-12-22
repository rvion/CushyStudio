import { observer } from 'mobx-react-lite'
import { useState } from 'react'

export const TabUI = observer(function TabUI_(p: {
    className?: string
    style?: React.CSSProperties
    children: React.ReactNode[]
}) {
    const x = p.children
    const [val, setVal] = useState(0)
    const headers = []
    const contents = []
    for (let i = 0; i < x.length; i += 2) {
        headers.push(x[i])
        contents.push(x[i + 1])
    }
    return (
        <div className={'flex flex-col TabUI ' + p.className} style={p.style}>
            <div tw='tablist tabs-lifted'>
                {headers.map((h, ix) => {
                    return (
                        <a
                            //
                            tw={['tab', ix === val && 'tab-active']}
                            onClick={() => setVal(ix)}
                            key={ix}
                        >
                            {h}
                        </a>
                    )
                })}
            </div>
            <div tw='bg-base-100 text-base-content flex-grow'>{contents[val]}</div>
        </div>
    )
})
