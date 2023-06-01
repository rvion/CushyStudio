import type { FolderL } from 'src/models/Folder'
import type { ImageL } from 'src/models/Image'

import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { useDrop } from 'react-dnd'
import { IconButton } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { ItemTypes } from './DnDItemTypes'
import { GalleryImageUI } from './GalleryImageUI'

export const GalleryFolderUI = observer(function GalleryFolderUI_(p: {
    //
    folder: FolderL
    direction: 'horizontal' | 'vertical'
}) {
    const st = useSt()
    const [collectedProps, drop] = useDrop(() => ({
        accept: ItemTypes.Image,
        drop(item: { image: ImageL }, monitor) {
            item.image.update({ folderID: p.folder.id })
        },
    }))

    return (
        <div
            style={{ flexDirection: p.direction === 'horizontal' ? 'row' : 'column' }}
            className='flex overflow-hidden'
            ref={drop}
        >
            <IconButton onClick={() => p.folder.delete()} icon={<I.Close />} size='xs' appearance='link' />
            {/* <Input style={{ width: '50px' }} value={p.folder.data.name ?? ''} onChange={(v) => p.folder.update({ name: v })} /> */}
            {/* 🟢{images.length}🟢 */}
            {p.folder.images.map((i) => (i ? <GalleryImageUI img={i} key={i.id} /> : null))}
        </div>
    )
})
