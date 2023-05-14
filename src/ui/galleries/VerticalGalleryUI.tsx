import { observer } from 'mobx-react-lite'
import { useSt } from '../../front/FrontStateCtx'
import { GalleryFolderUI } from './GalleryFolderUI'
import { GalleryImageUI } from './GalleryImageUI'

export const VerticalGalleryUI = observer(function VerticalGalleryUI_(p: {}) {
    const st = useSt()

    return (
        <div className='flex bg-gray-950'>
            <div className='flex flex-col' style={{ overflowX: 'auto' }}>
                {/* <div style={{ width: '50px' }}>All</div> */}
                {/* request to focus next  */}
                {/* <Button>next</Button> */}
                {/* <div>stream</div> */}
                {st.imageReversed.map((img, ix) => (
                    <GalleryImageUI key={ix} img={img} />
                ))}
            </div>
            {/* <div className='flex flex-col overflow-x-auto'> */}
            {Object.entries(st.db.data.folders).map(([k, v]) => {
                return (
                    <GalleryFolderUI //
                        direction='vertical'
                        key={k}
                        folderMetadata={v}
                        folderUID={k}
                    />
                )
            })}
            {/* </div> */}
        </div>
    )
})
