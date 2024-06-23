import type { MediaImageL } from '../models/MediaImage'

import { observer } from 'mobx-react-lite'

import { openExternal, showItemInFolder } from '../app/layout/openExternal'
import { DraftIllustrationUI } from '../cards/fancycard/DraftIllustration'
import { Button } from '../csuite/button/Button'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { IkonOf } from '../csuite/icons/iconHelpers'
import { useSt } from '../state/stateContext'

export const ImageDropdownUI = observer(function ImageDropdownUI_(p: { img: MediaImageL }) {
    const img = p.img
    return <Dropdown title='Actions' startIcon='mdiMenu' content={() => <ImageDropdownMenuUI img={img} />} />
})

export const ImageDropdownMenuUI = observer(function ImageDropdownMenuUI_(p: { img: MediaImageL }) {
    const st = useSt()
    const img = p.img
    return (
        <>
            <div className='divider my-1'>Send to</div>
            <MenuItem
                icon={<span className='material-symbols-outlined'>content_copy</span>}
                onClick={(e) => img.copyToClipboard()}
            >
                Clipboard
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>content_copy</span>}
                onClick={img.copyToClipboardAsBase64}
            >
                Copy Base64
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>settings_overscan</span>}
                disabled={!img?.absPath}
                onClick={() => st.layout.FOCUS_OR_CREATE('Image', { imageID: img.id })}
                shortcut='mod+click'
            >
                Dedicated Panel
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>center_focus_weak</span>}
                disabled={!img?.absPath}
                shortcut='shift+click'
                onClick={() => st.layout.FOCUS_OR_CREATE('Canvas', { imgID: img.id })}
            >
                Unified Canvas
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>brush</span>}
                disabled={!img?.absPath}
                shortcut='alt+click'
                onClick={() => st.layout.FOCUS_OR_CREATE('Paint', { imgID: img.id })}
            >
                MiniPaint
            </MenuItem>

            <div className='divider my-1'>FileSystem</div>
            <MenuItem
                icon={<IkonOf name='mdiStarShooting' color='gold' />}
                disabled={!st.getConfigValue('favoriteLocalFolderPath') || st.getConfigValue('favoriteLocalFolderPath') === ''}
                onClick={() => {
                    if (!img || !st.getConfigValue('favoriteLocalFolderPath')) return
                    return img.saveLocally(st.getConfigValue('favoriteLocalFolderPath') ?? '')
                }}
            >
                {ImagePathUIString(st.getConfigValue('favoriteLocalFolderPath'))}
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>folder</span>}
                disabled={!img?.absPath}
                onClick={() => {
                    if (!img?.absPath) return
                    return showItemInFolder(img.absPath)
                }}
            >
                Open folder
            </MenuItem>
            {/* 3. OPEN FILE ITSELF */}
            <MenuItem
                icon={<span className='material-symbols-outlined'>folder</span>}
                size='xs'
                disabled={!img?.absPath}
                onClick={() => {
                    const imgPathWithFileProtocol = img ? `file://${img.absPath}` : null
                    if (imgPathWithFileProtocol == null) return
                    return openExternal(imgPathWithFileProtocol)
                }}
            >
                Open
            </MenuItem>
            <div className='divider my-1'>Draft</div>
            <MenuItem className='_MenuItem' onClick={() => img.useAsDraftIllustration()}>
                <div className='flex items-center gap-2'>
                    <span className='material-symbols-outlined'>image</span>
                    Use as Draft Illustration
                </div>
            </MenuItem>
            <div className='divider my-0'></div>
            <MenuItem
                icon={<span className='material-symbols-outlined text-red-500'>delete</span>}
                disabled={!img?.absPath}
                onClick={() => img.delete()}
            >
                Delete
            </MenuItem>
            <ImageActionMenu img={img} />
        </>
    )
})

const ImagePathUIString = (path: string | undefined): string => {
    if (!path || path === '') {
        return 'Define Settings > Config > Local folder to save favorites'
    } else {
        return `Save Copy to ${path.substring(0, 6)}...
    ${path.substring(path.length - 11, path.length)}`
    }
}

export const ImageActionMenu = observer(function ImageActionMenu_(p: { img: MediaImageL }) {
    const st = useSt()
    const img = p.img
    return (
        <>
            {st.allImageApps.map((app) => {
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
                                        <Button
                                            square
                                            icon='mdiOpenInNew'
                                            onClick={(ev) => {
                                                ev.stopPropagation()
                                                ev.preventDefault()
                                                d.openOrFocusTab()
                                            }}
                                        ></Button>
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
