import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Civitai, CivitaiSearchResultItem } from './CivitaiSpec'

import { Panel } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { CivitaiResultUI } from './CivitaiResultUI'

export const CivitaiUI = observer(function CivitaiUI_() {
    const civitai = useMemo(() => new Civitai(), [])
    const st = useSt()
    return (
        <Panel>
            <div>Civitai</div>

            <div className='row gap'>
                <input
                    // contentBefore={<I.Search24Filled />}
                    placeholder='rechercher'
                    value={civitai.query}
                    onChange={(ev) => (civitai.query = (ev.target as any).value)}
                    // onChange={(ev: React.ChangeEventHandler<HTMLInputElement>) => (c.query = ev.target.value)}
                ></input>
                <div
                    tw='btn btn-primary'
                    // icon={<I.Search24Filled />}
                    onClick={async () => {
                        const res = await civitai.search({ query: civitai.query, page: '1' })
                        console.log(res)
                    }}
                ></div>
            </div>
            {civitai.results && (
                <div
                    tw='bd'
                    style={{
                        height: '40rem',
                        // display: 'flex',
                        overflow: 'auto',
                    }}
                >
                    {civitai.results.items.map((i: CivitaiSearchResultItem) => (
                        <CivitaiResultUI i={i} />
                    ))}
                </div>
            )}
        </Panel>
    )
})
