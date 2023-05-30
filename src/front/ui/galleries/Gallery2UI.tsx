import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { GalleryFolderUI } from './GalleryFolderUI'
import { GalleryImageUI } from './GalleryImageUI'

export const Gallery2UI = observer(function Gallery2UI_(p: {}) {
    const st = useSt()

    return (
        <>
            <div className='flex flex-col overflow-x-auto'>
                <div>New Folder</div>
                {st.db.folders.map((v) => {
                    return <GalleryFolderUI direction='horizontal' key={v.id} folderL={v} folderUID={v.id} />
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
