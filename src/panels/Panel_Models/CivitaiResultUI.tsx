import { observer } from 'mobx-react-lite'
import { CivitaiSearchResultItem } from './CivitaiSpec'

// const x = <Panel>
//     <CardHeader>{i.name}</CardHeader>
//     <CardPreview>
//     {/* {i.modelVersions[0].images.map(i => <Image width={200} fit='contain' src={i.url}/>)} */}
//     </CardPreview >
//     </Panel>
// </Panel>

export const CivitaiResultUI = observer(function CivitaiResultUI_(p: { i: CivitaiSearchResultItem }) {
    const i = p.i
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
})
