import type { FolderL } from 'src/models/Folder'

import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { GalleryFolderUI } from './GalleryFolderUI'
import { GalleryImageUI } from './GalleryImageUI'

export const VerticalGalleryUI = observer(function VerticalGalleryUI_(p: {}) {
    const st = useSt()

    return (
        <div className='flex-col flex'>
            <Button onClick={() => st.createFolder()}>Add folder</Button>
            <div className='flex bg-gray-950'>
                {/* MAIN IMAGE COLUMN */}
                <div className='flex flex-col' style={{ overflowX: 'auto' }}>
                    {st.imageReversed.map((img, ix) => (
                        <GalleryImageUI key={ix} img={img} />
                    ))}
                </div>
                {/*  EXTRA FOLDERS */}
                {st.db.folders.map((v: FolderL) => {
                    return (
                        <GalleryFolderUI //
                            direction='vertical'
                            key={v.id}
                            folder={v}
                        />
                    )
                })}
            </div>
        </div>
    )
})
