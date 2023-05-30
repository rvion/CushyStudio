import type { FolderL } from 'src/models/Folder'

import { observer } from 'mobx-react-lite'
import { useSt } from '../../FrontStateCtx'
import { GalleryFolderUI } from './GalleryFolderUI'
import { GalleryImageUI } from './GalleryImageUI'
import { Button } from 'rsuite'
import { nanoid } from 'nanoid'

export const VerticalGalleryUI = observer(function VerticalGalleryUI_(p: {}) {
    const st = useSt()

    return (
        <div className='flex-col flex'>
            <Button
                onClick={() => {
                    st.db.folders.create({ id: nanoid(), name: 'new folder' })
                }}
            >
                Add folder
            </Button>
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
                {st.db.folders.map((v: FolderL) => {
                    return (
                        <GalleryFolderUI //
                            direction='vertical'
                            key={v.id}
                            folderL={v}
                            folderUID={v.id}
                        />
                    )
                })}
                {/* </div> */}
            </div>
        </div>
    )
})
