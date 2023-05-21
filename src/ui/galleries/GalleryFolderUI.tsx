import { observer } from 'mobx-react-lite'
import { ImageT } from 'src/models/Image'
import { useSt } from '../../front/FrontStateCtx'
import { ItemTypes } from './ItemTypes'
import { useDrop } from 'react-dnd'
import { FolderT, FolderUID } from 'src/models/Folder'
import { GalleryImageUI } from './GalleryImageUI'
import { toJS } from 'mobx'
import { Input } from 'rsuite'

export const GalleryFolderUI = observer(function FolderUI_(p: {
    //
    folderUID: FolderUID
    folderMetadata: FolderT
    direction: 'horizontal' | 'vertical'
}) {
    const st = useSt()
    const [collectedProps, drop] = useDrop(() => ({
        accept: ItemTypes.Image,
        drop(image: { img: ImageT }, monitor) {
            console.log('🔴 drop?', toJS(image.img))
            // st.db.moveFile(image.img, p.folderUID)
        },
    }))

    const images = p.folderMetadata.imageUIDs?.map((i) => st.imagesById.get(i)) ?? []
    console.log(images, [...st.imagesById.keys()])
    return (
        <div
            style={{ flexDirection: p.direction === 'horizontal' ? 'row' : 'column' }}
            className='flex overflow-hidden'
            ref={drop}
        >
            <Input
                //
                style={{ width: '50px' }}
                value={p.folderMetadata.name ?? p.folderUID.slice(0, 5)}
                onChange={(v) => (p.folderMetadata.name = v)}
            />
            {/* 🟢{images.length}🟢 */}
            {images.map((i) => (i ? <GalleryImageUI img={i} key={i.id} /> : null))}
        </div>
    )
})
