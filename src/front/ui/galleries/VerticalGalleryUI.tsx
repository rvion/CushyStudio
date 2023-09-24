import type { FolderL } from 'src/models/Folder'

import { observer } from 'mobx-react-lite'
import { useSt } from '../../FrontStateCtx'
import { GalleryFolderUI } from './GalleryFolderUI'
import { ImageUI, PlaceholderImageUI } from './ImageUI'
import { useImageDrop } from './dnd'

export const VerticalGalleryUI = observer(function VerticalGalleryUI_(p: {}) {
    const st = useSt()
    const [dropStyle, dropRef] = useImageDrop((i) => {
        i.update({ folderID: null })
    })
    return (
        <div className='flex col-folder'>
            {/* MAIN IMAGE COLUMN */}
            <div
                //
                ref={dropRef}
                //  [background:#343434]
                className='shrink-0 relative overflow-auto noscrollbar rounded-lg'
                style={{ width: '3.4rem', ...dropStyle }}
            >
                <div className='text-center'>Images</div>
                {/* <IconButton disabled icon={<I.Close />} size='xs' appearance='link'></IconButton> */}
                {st.preview ? <img style={{ width: '64px', height: '64px' }} src={st.preview.url} /> : null}

                <div className='absolute insert-0'>
                    <div className='flex flex-col-reverse' style={{ overflowX: 'auto' }}>
                        <PlaceholderImageUI />
                        {st.imageReversed.map((img, ix) => (
                            <ImageUI key={ix} img={img} />
                        ))}
                    </div>
                </div>
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
    )
})
