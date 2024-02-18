import { observer } from 'mobx-react-lite'
import { showItemInFolder, openExternal } from 'src/app/layout/openExternal'
import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { DraftIllustrationUI } from 'src/cards/fancycard/DraftIllustration'
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
            <div className='divider divider-start my-0'>send to</div>
            <MenuItem
                icon={<span className='material-symbols-outlined'>settings_overscan</span>}
                disabled={!img?.absPath}
                onClick={() => st.layout.FOCUS_OR_CREATE('Image', { imageID: img.id })}
                shortcut={'mod+click'}
            >
                dedicated panel (ctrl+click)
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>center_focus_weak</span>}
                disabled={!img?.absPath}
                shortcut={'shift+click'}
                onClick={() => st.layout.FOCUS_OR_CREATE('Canvas', { imgID: img.id })}
            >
                unified Canvas (shift+click)
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>brush</span>}
                disabled={!img?.absPath}
                shortcut={'alt+click'}
                onClick={() => st.layout.FOCUS_OR_CREATE('Paint', { imgID: img.id })}
            >
                MiniPaint (alt+click)
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined text-red-500'>delete</span>}
                disabled={!img?.absPath}
                onClick={() => img.delete()}
            >
                delete
            </MenuItem>
            <div className='divider divider-start my-0'>FileSystem</div>
            <MenuItem
                icon={<span className='material-symbols-outlined'>folder</span>}
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
            <div className='divider divider-start my-0'>Draft</div>
            <MenuItem className='_MenuItem' onClick={() => img.useAsDraftIllustration()}>
                <div className='flex items-center gap-2'>
                    <span className='material-symbols-outlined'>image</span>
                    Use as draft illustration
                </div>
            </MenuItem>
            <div className='divider divider-start my-0'>send to</div>
            <ImageActionMenu img={img} />
        </>
    )
})

export const ImageActionMenu = observer(function ImageActionMenu_(p: { img: MediaImageL }) {
    const st = useSt()
    const img = p.img
    return (
        <>
            {st.allImageAppsCollectitons.map((app) => {
                return (
                    <div key={app.id}>
                        {app.drafts.map((d) => (
                            <MenuItem
                                key={d.id}
                                className='_MenuItem'
                                onClick={() => {
                                    d.start({ imageToStartFrom: img })
                                }}
                            >
                                <div className='flex flex-1 items-center gap-2'>
                                    <DraftIllustrationUI draft={d} size='1.2rem' />
                                    {d.name}
                                    <div className='ml-auto line'>
                                        <div tw='opacity-55 italic'>{d.app.name}</div>
                                        <div
                                            onClick={(ev) => {
                                                ev.stopPropagation()
                                                ev.preventDefault()
                                                d.openOrFocusTab()
                                            }}
                                            tw='btn btn-xs btn-square'
                                        >
                                            <span className='material-symbols-outlined'>open_in_new</span>
                                        </div>
                                    </div>
                                </div>
                            </MenuItem>
                        ))}
                    </div>
                )
            })}
        </>
    )
})
