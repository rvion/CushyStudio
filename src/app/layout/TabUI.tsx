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
        <div className={'TabUI ' + p.className} style={p.style}>
            <div tw='tabs tabs-lifted tabs-sm'>
                {headers.map((h, ix) => {
                    return (
                        <a onClick={() => setVal(ix)} className='tab' key={ix}>
                            {h}
                        </a>
                    )
                })}
            </div>
            <div tw='bg-base-100 text-base-content'>{contents[val]}</div>
        </div>
    )
})
