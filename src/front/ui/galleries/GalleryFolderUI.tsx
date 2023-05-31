import type { FolderL } from 'src/models/Folder'
import type { ImageL } from 'src/models/Image'

import { observer } from 'mobx-react-lite'
import { useDrop } from 'react-dnd'
import { Button, Input } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { GalleryImageUI } from './GalleryImageUI'
import { ItemTypes } from './ItemTypes'

export const GalleryFolderUI = observer(function GalleryFolderUI_(p: {
    //
    folder: FolderL
    direction: 'horizontal' | 'vertical'
}) {
    const st = useSt()
    const [collectedProps, drop] = useDrop(() => ({
        accept: ItemTypes.Image,
        drop(item: { image: ImageL }, monitor) {
            // console.log('🔴 drop?', toJS(item.image))
            item.image.update({ folderID: p.folder.id })

            // st.db.moveFile(image.img, p.folderUID)
        },
    }))

    // return null
    // const images = []
    // const images = p.folderL.data.imageUIDs?.map((i) => st.imagesById.get(i)) ?? []
    // 🔴
    // console.log(images, [...st.imagesById.keys()])
    return (
        <div
            style={{ flexDirection: p.direction === 'horizontal' ? 'row' : 'column' }}
            className='flex overflow-hidden'
            ref={drop}
        >
            <Button onClick={() => p.folder.delete()}>X</Button>
            <Input style={{ width: '50px' }} value={p.folder.data.name ?? ''} onChange={(v) => p.folder.update({ name: v })} />
            {/* 🟢{images.length}🟢 */}
            {p.folder.images.map((i) => (i ? <GalleryImageUI img={i} key={i.id} /> : null))}
        </div>
    )
})
