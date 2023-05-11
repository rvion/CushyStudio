import { observer } from 'mobx-react-lite'
import { FolderUID, ImageInfos } from 'src/core/GeneratedImageSummary'
import { useSt } from '../../front/stContext'
import { ItemTypes } from './ItemTypes'
import { useDrop } from 'react-dnd'
import { CushyFolderMetadata } from 'src/core/WorkspaceHistoryJSON'
import { GalleryImageUI } from './GalleryImageUI'
import { toJS } from 'mobx'
import { Input } from 'rsuite'

export const GalleryFolderUI = observer(function FolderUI_(p: {
    //
    folderUID: FolderUID
    folderMetadata: CushyFolderMetadata
    direction: 'horizontal' | 'vertical'
}) {
    const st = useSt()
    const [collectedProps, drop] = useDrop(() => ({
        accept: ItemTypes.Image,
        drop(image: { img: ImageInfos }, monitor) {
            console.log('🟢', toJS(image.img))
            st.db.moveFile(image.img, p.folderUID)
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
            {images.map((i) => (i ? <GalleryImageUI img={i} key={i.uid} /> : null))}
        </div>
    )
})
