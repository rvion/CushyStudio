import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { GalleryFolderUI } from './GalleryFolderUI'
import { ImageUI } from './ImageUI'

export const Gallery2UI = observer(function Gallery2UI_(p: {}) {
    const st = useSt()

    return (
        <>
            <div className='flex flex-col overflow-x-auto'>
                <div>New Folder</div>
                {st.db.folders.map((v) => {
                    return <GalleryFolderUI direction='horizontal' key={v.id} folder={v} />
                })}
            </div>
            <div style={{ display: 'flex', overflowX: 'auto' }}>
                {/* request to focus next  */}
                <Button>next</Button>
                {st.imageReversed.map((img, ix) => (
                    <ImageUI key={ix} img={img} />
                ))}
            </div>
        </>
    )
})
