import { observer } from 'mobx-react-lite'

import { CivitaiResultCardUI } from './CivitaiResultCardUI'
import { CivitaiResultFullUI } from './CivitaiResultFullUI'
import { Civitai, CivitaiSearchResultItem } from './CivitaiSpec'

export const CivitaiUI = observer(function CivitaiUI_(p: { className?: string; civitai: Civitai }) {
    const civitai = p.civitai
    return (
        <div tw='flex flex-col overflow-auto' className={p.className}>
            <div tw='flex flex-1 overflow-auto'>
                <div // LEFT-COLUMN (search + search results)
                    tw='flex flex-col'
                    style={{ borderRight: '1px solid #aaa' }}
                >
                    <div // SEARCH
                        className='row gap'
                    >
                        <div className='join m-1'>
                            <input
                                tw='input input-bordered input-sm'
                                placeholder='rechercher'
                                value={civitai.query.value}
                                onChange={(ev) => (civitai.query.value = (ev.target as any).value)}
                            />
                        </div>
                    </div>
                    <div //RESULS
                        tw='flex flex-col flex-initial overflow-auto'
                    >
                        {civitai.results?.ui((x) =>
                            x.items.map((i: CivitaiSearchResultItem) => (
                                <CivitaiResultCardUI key={i.id} civitai={civitai} item={i} />
                            )),
                        )}
                    </div>
                </div>
                <div //DETAILS
                >
                    {civitai.selectedResult && ( //
                        <CivitaiResultFullUI civitai={civitai} item={civitai.selectedResult} />
                    )}
                </div>
            </div>
        </div>
    )
})
