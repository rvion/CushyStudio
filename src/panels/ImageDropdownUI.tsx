import { observer } from 'mobx-react-lite'
import { showItemInFolder, openExternal } from 'src/app/layout/openExternal'
import { MediaImageL } from 'src/models/MediaImage'
import { Dropdown, MenuItem } from 'src/rsuite/Dropdown'
import { useSt } from 'src/state/stateContext'

export const ImageDropdownUI = observer(function ImageDropdownUI_(p: { img: MediaImageL }) {
    const st = useSt()
    const img = p.img
    return (
        <Dropdown title='Actions' startIcon={<span className='material-symbols-outlined'>menu</span>}>
            <ImageDropdownMenuUI img={img} />
        </Dropdown>
    )
})

export const ImageDropdownMenuUI = observer(function ImageDropdownMenuUI_(p: { img: MediaImageL }) {
    const st = useSt()
    const img = p.img

    return (
        <>
            <MenuItem
                icon={<span className='material-symbols-outlined'>folder</span>}
                size='sm'
                // appearance='subtle'
                disabled={!img?.absPath}
                onClick={() => {
                    if (!img?.absPath) return
                    showItemInFolder(img.absPath)
                }}
            >
                open folder
            </MenuItem>
            {/* 3. OPEN FILE ITSELF */}
            <MenuItem
                icon={<span className='material-symbols-outlined'>folder</span>}
                size='xs'
                // appearance='subtle'
                disabled={!img?.absPath}
                onClick={() => {
                    const imgPathWithFileProtocol = img ? `file://${img.absPath}` : null
                    if (imgPathWithFileProtocol == null) return
                    openExternal(imgPathWithFileProtocol)
                }}
            >
                open
            </MenuItem>
            <MenuItem className='_MenuItem' onClick={() => img.useAsDraftIllustration()}>
                <div className='flex items-center gap-2'>
                    <span className='material-symbols-outlined'>image</span>
                    Use as draft illustration
                </div>
            </MenuItem>
            <MenuItem className='_MenuItem' onClick={() => st.layout.FOCUS_OR_CREATE('Paint', { imgID: img.id })}>
                <div className='flex items-center gap-2'>
                    <span className='material-symbols-outlined'>edit</span>
                    Paint
                </div>
            </MenuItem>
        </>
    )
})
