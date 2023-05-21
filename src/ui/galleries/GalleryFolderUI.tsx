import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useDrop } from 'react-dnd'
import { Button, Input } from 'rsuite'
import { FolderL, FolderUID } from 'src/models/Folder'
import { ImageT } from 'src/models/Image'
import { useSt } from '../../front/FrontStateCtx'
import { GalleryImageUI } from './GalleryImageUI'
import { ItemTypes } from './ItemTypes'

export const GalleryFolderUI = observer(function GalleryFolderUI_(p: {
    //
    folderUID: FolderUID
    folderL: FolderL
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

    const images = p.folderL.data.imageUIDs?.map((i) => st.imagesById.get(i)) ?? []
    console.log(images, [...st.imagesById.keys()])
    return (
        <div
            style={{ flexDirection: p.direction === 'horizontal' ? 'row' : 'column' }}
            className='flex overflow-hidden'
            ref={drop}
        >
            <Button onClick={() => p.folderL.delete()}>X</Button>
            <Input
                style={{ width: '50px' }}
                value={p.folderL.data.name ?? p.folderUID.slice(0, 5)}
                onChange={(v) => p.folderL.update({ name: v })}
            />
            {/* 🟢{images.length}🟢 */}
            {images.map((i) => (i ? <GalleryImageUI img={i} key={i.id} /> : null))}
        </div>
    )
})
