import { CSSProperties, ReactElement, ReactNode, useState } from 'react'

import { observer, useAsObservableSource } from 'mobx-react-lite'
import { Button, ButtonGroup } from 'rsuite'

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
    disabled?: boolean
}) {
    const [onIx, setIx] = useState(() => p.current ?? 0)
    const tabHeader = (
        <ButtonGroup size='xs' disabled={p.disabled}>
            {p.title ? <div tw='mr-3'>{p.title}</div> : null}
            {p.tabs.map((tab, ix) => {
                const active = ix === onIx
                return (
                    <Button
                        color={p.disabled ? undefined : 'blue'}
                        active={active}
                        appearance={active ? 'primary' : 'ghost'}
                        key={ix}
                        onClick={() => {
                            // if (p.disabled) return
                            p.onClick?.(ix)
                            setIx(ix)
                        }}
                    >
                        {tab.title()}
                    </Button>
                )
            })}
        </ButtonGroup>
    )
    const selectedTab = p.tabs[onIx]
    return (
        <div style={p.style} tw={['_TabsUI', p.className, p.grow && '_grow', 'relative']}>
            {p.bottomTabs ? null : tabHeader}
            <div className='_tab_body'>
                {selectedTab ? ( //
                    <TabBodyWrapperUI key={onIx} fn={selectedTab.body} />
                ) : (
                    <>no tab {onIx}</>
                )}
                {p.disabled && <div tw='inset-0 absolute pointer-events-none' style={{ background: 'rgba(0,0,0,0.5)' }}></div>}
            </div>
            {p.bottomTabs && tabHeader}
        </div>
    )
})

const TabBodyWrapperUI = observer(function TabBodyWrapperUI_(p: { fn: TabBody }) {
    return p.fn()
})
