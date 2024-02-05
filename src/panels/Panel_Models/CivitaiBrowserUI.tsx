import { observer } from 'mobx-react-lite'
import { Civitai, CivitaiSearchResultItem } from './CivitaiSpec'

import { CivitaiResultCardUI } from './CivitaiResultCardUI'
import { CivitaiResultFullUI } from './CivitaiResultFullUI'

export const CivitaiUI = observer(function CivitaiUI_(p: { className?: string; civitai: Civitai }) {
    const civitai = p.civitai
    return (
        <div tw='flex flex-col overflow-auto' className={p.className}>
            {/* SEARCH */}
            <div className='row gap'>
                <div className='join m-1'>
                    <input
                        tw='input input-bordered input-sm'
                        placeholder='rechercher'
                        value={civitai.query}
                        onChange={(ev) => (civitai.query = (ev.target as any).value)}
                    />
                    <div
                        tw='btn btn-primary btn-sm'
                        // icon={<I.Search24Filled />}
                        onClick={async () => {
                            const res = await civitai.search({ query: civitai.query, page: '1' })
                            console.log(res)
                        }}
                    >
                        <span className='material-symbols-outlined'>search</span>
                    </div>
                </div>
            </div>
            {/* RESULS */}
            <div tw='flex flex-1 overflow-auto'>
                {/* LIST */}
                <div tw='flex-initial flex flex-col gap-1 flex-1 overflow-auto'>
                    {civitai.results?.items.map((i: CivitaiSearchResultItem) => (
                        <CivitaiResultCardUI civitai={civitai} item={i} />
                    ))}
                </div>
                {/* DETAILS */}
                <div tw='flex-1 bg-base-200'>
                    {civitai.selectedResult && <CivitaiResultFullUI civitai={civitai} item={civitai.selectedResult} />}
                </div>
            </div>
        </div>
    )
})
