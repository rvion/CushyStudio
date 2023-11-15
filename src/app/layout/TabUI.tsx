import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Nav, NavItem } from 'src/rsuite/shims'

export const TabUI = observer(function TabUI_(p: {
    className?: string
    style?: React.CSSProperties
    title?: string
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
            <Nav className='xs' appearance='tabs' activeKey={`${val}`} onSelect={(k: string) => setVal(parseInt(k, 10))}>
                {p.title && (
                    <NavItem disabled key={p.title} eventKey={`_`}>
                        {p.title}
                    </NavItem>
                )}
                {headers.map((h, ix) => {
                    return (
                        <NavItem key={ix} eventKey={`${ix}`}>
                            {h}
                        </NavItem>
                    )
                })}
            </Nav>
            <div>{contents[val]}</div>
        </div>
    )
})
