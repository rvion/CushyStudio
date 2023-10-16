import { CSSProperties, ReactElement, ReactNode, useState } from 'react'

import { observer } from 'mobx-react-lite'

type TabBody = () => ReactElement | null
type Tab = {
    title: () => ReactNode
    body: TabBody
}

export const TabsUI = observer(function Tabs_(p: {
    //
    title?: string
    tabs: Tab[]
    onClick?: (ix: number) => void
    current?: number
    style?: CSSProperties
    className?: string
    grow?: boolean
    bottomTabs?: boolean
}) {
    const [onIx, setIx] = useState(() => p.current ?? 0)
    const tabHeader = (
        <div tw={['flex _tab_headers', p.bottomTabs ? '_bottom_headers' : '_top_headers']}>
            {p.title ? <div tw='mr-3'>{p.title}</div> : null}
            {p.tabs.map((tab, ix) => (
                <div
                    key={ix}
                    tw={['p-3 cursor-pointer hover:(bg-gray-100)', '_header_tab', ix === onIx ? 'active' : undefined]}
                    onClick={() => {
                        p.onClick?.(ix)
                        setIx(ix)
                    }}
                >
                    {tab.title()}
                </div>
            ))}
            <div // SPACER
                style={{
                    flexGrow: 1,
                    borderBottom: p.bottomTabs ? undefined : '1px solid gray',
                    borderTop: p.bottomTabs ? '1px solid gray' : undefined,
                    alignSelf: 'stretch',
                }}
            ></div>
        </div>
    )
    return (
        <div style={p.style} tw={['_TabsUI', p.className, p.grow && '_grow']}>
            {p.bottomTabs ? null : tabHeader}
            <div className='_tab_body'>
                <TabBodyWrapperUI key={onIx} fn={p.tabs[onIx]!.body} />
            </div>
            {p.bottomTabs && tabHeader}
        </div>
    )
})

const TabBodyWrapperUI = observer(function TabBodyWrapperUI_(p: { fn: TabBody }) {
    return p.fn()
})
