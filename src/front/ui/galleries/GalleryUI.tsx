import { observer } from 'mobx-react-lite'
import { Slider } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
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
                <div tw='text-center'>
                    <div tw='text-gray-400'>Image size</div>
                    <Slider
                        tw='m-2'
                        style={{ width: '5rem' }}
                        min={32}
                        max={200}
                        onChange={(v) => (st.gallerySize = v)}
                        value={st.gallerySize}
                    ></Slider>
                </div>
                {st.preview ? <img style={{ width: st.gallerySizeStr, height: st.gallerySizeStr }} src={st.preview.url} /> : null}
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
