import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { Civitai } from './CivitaiSpec'

import { Panel } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'

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
                    {civitai.results.items.map((i) => {
                        const v0 = i.modelVersions[0]
                        const v0Imgs = v0.images
                        const img0 = v0Imgs[0]
                        return (
                            <div>
                                {/* <CardHeader>{i.name}</CardHeader> */}
                                <div>{i.name}</div>
                                {/* <div>{i.id}</div> */}
                                <div>{i.modelVersions.length} version</div>
                                {/* <CardPreview> */}
                                <img key={img0.url} height={100} width={100} src={img0.url} />
                                {/* </CardPreview> */}
                            </div>
                        )
                    })}
                </div>
            )}
        </Panel>
    )
})

// const x = <Panel>
//     <CardHeader>{i.name}</CardHeader>
//     <CardPreview>
//     {/* {i.modelVersions[0].images.map(i => <Image width={200} fit='contain' src={i.url}/>)} */}
//     </CardPreview >
//     </Panel>
// </Panel>

export const CivitaiCardUI = observer(function CivitaiCardUI_(p: {}) {
    return (
        <div
            style={{
                height: '40rem',
                // display: 'flex',
                overflow: 'auto',
            }}
        >
            {civitai.results.items.map((i) => {
                const v0 = i.modelVersions[0]
                const v0Imgs = v0.images
                const img0 = v0Imgs[0]
                return (
                    <div>
                        {/* <CardHeader>{i.name}</CardHeader> */}
                        <div>{i.name}</div>
                        {/* <div>{i.id}</div> */}
                        <div>{i.modelVersions.length} version</div>
                        {/* <CardPreview> */}
                        <img key={img0.url} height={100} width={100} src={img0.url} />
                        {/* </CardPreview> */}
                    </div>
                )
            })}
        </div>
    )
})
