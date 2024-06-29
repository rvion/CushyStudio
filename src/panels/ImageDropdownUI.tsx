import type { MediaImageL } from '../models/MediaImage'

import { observer } from 'mobx-react-lite'

import { openExternal, showItemInFolder } from '../app/layout/openExternal'
import { DraftIllustrationUI } from '../cards/fancycard/DraftIllustration'
import { Button } from '../csuite/button/Button'
import { Dropdown } from '../csuite/dropdown/Dropdown'
import { MenuItem } from '../csuite/dropdown/MenuItem'
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
            <MenuItem icon={'mdiContentCopy'} onClick={(e) => img.copyToClipboard()}>
                Clipboard
            </MenuItem>
            <MenuItem icon={'mdiContentCopy'} onClick={img.copyToClipboardAsBase64}>
                Copy Base64
            </MenuItem>
            <MenuItem
                icon={'mdiOverscan'}
                disabled={!img?.absPath}
                onClick={() => st.layout.FOCUS_OR_CREATE('Image', { imageID: img.id })}
                localShortcut='mod+click'
            >
                Dedicated Panel
            </MenuItem>
            <MenuItem
                icon={'mdiFocusAuto'}
                disabled={!img?.absPath}
                localShortcut='shift+click'
                onClick={() => st.layout.FOCUS_OR_CREATE('Canvas', { imgID: img.id })}
            >
                Unified Canvas
            </MenuItem>
            <MenuItem
                icon={'mdiBrush'}
                disabled={!img?.absPath}
                localShortcut='alt+click'
                onClick={() => st.layout.FOCUS_OR_CREATE('Paint', { imgID: img.id })}
            >
                MiniPaint
            </MenuItem>

            <div className='divider my-1'>FileSystem</div>
            <MenuItem
                icon='mdiStarShooting'
                iconClassName='[color:gold]'
                disabled={!st.getConfigValue('favoriteLocalFolderPath') || st.getConfigValue('favoriteLocalFolderPath') === ''}
                onClick={() => {
                    if (!img || !st.getConfigValue('favoriteLocalFolderPath')) return
                    return img.saveLocally(st.getConfigValue('favoriteLocalFolderPath') ?? '')
                }}
            >
                {ImagePathUIString(st.getConfigValue('favoriteLocalFolderPath'))}
            </MenuItem>
            <MenuItem
                icon={'mdiFolder'}
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
                icon='mdiFile'
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
                <div className='flex items-center gap-2'>'image' Use as Draft Illustration</div>
            </MenuItem>
            <div className='divider my-0'></div>
            <MenuItem icon={'mdiDelete'} disabled={!img?.absPath} onClick={() => img.delete()}>
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
                                    d.start({ context: { image: img } })
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
