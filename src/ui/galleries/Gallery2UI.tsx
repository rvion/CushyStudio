import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { useSt } from '../../front/stContext'
import { GalleryFolderUI } from './GalleryFolderUI'
import { GalleryImageUI } from './GalleryImageUI'

export const Gallery2UI = observer(function Gallery2UI_(p: {}) {
    const st = useSt()

    return (
        <>
            <div className='flex flex-col overflow-x-auto'>
                <div>New Folder</div>
                {Object.entries(st.db.data.folders).map(([k, v]) => {
                    return <GalleryFolderUI direction='horizontal' key={k} folderMetadata={v} folderUID={k} />
                })}
            </div>
            <div style={{ display: 'flex', overflowX: 'auto' }}>
                {/* request to focus next  */}
                <Button>next</Button>
                {st.imageReversed.map((img, ix) => (
                    <GalleryImageUI key={ix} img={img} />
                ))}
            </div>
        </>
    )
})

export const Gallery2HUI = observer(function Gallery2UI_(p: {}) {
    const st = useSt()

    return (
        <div className='flex bg-gray-950'>
            <div className='flex flex-col' style={{ overflowX: 'auto' }}>
                {/* request to focus next  */}
                {/* <Button>next</Button> */}
                {/* <div>stream</div> */}
                {st.imageReversed.map((img, ix) => (
                    <GalleryImageUI key={ix} img={img} />
                ))}
            </div>
            {/* <div className='flex flex-col overflow-x-auto'> */}
            {Object.entries(st.db.data.folders).map(([k, v]) => {
                return <GalleryFolderUI direction='vertical' key={k} folderMetadata={v} folderUID={k} />
            })}
            {/* </div> */}
        </div>
    )
})
