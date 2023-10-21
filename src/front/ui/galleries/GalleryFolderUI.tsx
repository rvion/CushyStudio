// ⏸️ import type { FolderL } from 'src/models/Folder'
// ⏸️
// ⏸️ import * as I from '@rsuite/icons'
// ⏸️ import { observer } from 'mobx-react-lite'
// ⏸️ import { IconButton } from 'rsuite'
// ⏸️ import { ImageUI } from './ImageUI'
// ⏸️ import { useImageDrop } from './dnd'
// ⏸️
// ⏸️ export const GalleryFolderUI = observer(function GalleryFolderUI_(p: {
// ⏸️     //
// ⏸️     folder: FolderL
// ⏸️     direction: 'horizontal' | 'vertical'
// ⏸️ }) {
// ⏸️     const [collectedProps, drop] = useImageDrop((img) => {
// ⏸️         img.update({ folderID: p.folder.id })
// ⏸️     })
// ⏸️     return (
// ⏸️         <div
// ⏸️             style={{ flexDirection: p.direction === 'horizontal' ? 'row' : 'column', ...collectedProps }}
// ⏸️             className='flex overflow-hidden'
// ⏸️             ref={drop}
// ⏸️         >
// ⏸️             <IconButton
// ⏸️                 //
// ⏸️                 onClick={() => p.folder.delete()}
// ⏸️                 icon={<I.Close />}
// ⏸️                 size='xs'
// ⏸️                 appearance='link'
// ⏸️             />
// ⏸️             {/* <Input style={{ width: '50px' }} value={p.folder.data.name ?? ''} onChange={(v) => p.folder.update({ name: v })} /> */}
// ⏸️             {/* 🟢{images.length}🟢 */}
// ⏸️             {p.folder.images.map((i) => (i ? <ImageUI img={i} key={i.id} /> : null))}
// ⏸️         </div>
// ⏸️     )
// ⏸️ })
