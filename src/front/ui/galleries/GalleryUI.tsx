import type { FolderL } from 'src/models/Folder'

import { observer } from 'mobx-react-lite'
import { useSt } from '../../FrontStateCtx'
import { GalleryFolderUI } from './GalleryFolderUI'
import { ImageUI } from './ImageUI'
import { useImageDrop } from './dnd'

export const GalleryUI = observer(function VerticalGalleryUI_(p: {}) {
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop((i) => {
        i.update({ folderID: null })
    })
    return (
        <div className='flex flex-wrap col-folder' style={{ borderRight: '1px solid #383838' }}>
            {/* MAIN IMAGE COLUMN */}
            <div
                ref={dropRef}
                className='flex flex-wrap items-start'
                style={dropStyle}
                // style={{ width: '3.4rem', ...dropStyle }}
            >
                {st.preview ? <img style={{ width: st.gallerySize, height: st.gallerySize }} src={st.preview.url} /> : null}
                {/* <div className='text-center'>Images</div> */}
                {/* <IconButton size='xs' appearance='link' icon={<>📂</>}></IconButton> */}

                {/* <div className='absolute insert-0'> */}
                {/* <div className='flex flex-row-reverse' style={{ overflowX: 'auto' }}> */}
                {/* <PlaceholderImageUI /> */}
                {st.imageToDisplay.map((img, ix) => (
                    <ImageUI key={ix} img={img} />
                ))}
                {/* </div> */}
                {/* </div> */}
            </div>

            {/*  EXTRA FOLDERS */}
            {/* {st.db.folders.map((v: FolderL) => {
                return (
                    <GalleryFolderUI //
                        direction='horizontal'
                        key={v.id}
                        folder={v}
                    />
                )
            })} */}
        </div>
    )
})
