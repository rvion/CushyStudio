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
                    return <GalleryFolderUI key={k} folderMetadata={v} folderUID={k} />
                })}
            </div>
            <div style={{ display: 'flex', overflowX: 'auto' }}>
                {/* request to focus next  */}
                <Button>next</Button>
                {st.images.map((img, ix) => (
                    <GalleryImageUI key={ix} img={img} />
                ))}
            </div>
        </>
    )
})
