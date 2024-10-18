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
    return (
        <Dropdown //
            title='Actions'
            // startIcon='mdiMenu'
            content={() => <ImageDropdownMenuUI img={img} />}
        />
    )
})

export const ImageDropdownMenuUI = observer(function ImageDropdownMenuUI_(p: { img: MediaImageL }) {
    const st = useSt()
    const img = p.img
    return (
        <>
            <MenuItem //
                icon='mdiDelete'
                disabled={!img?.absPath}
                onClick={() => img.delete({})}
                label='Delete'
            />
            <MenuItem.Divider children='Send to' />
            <MenuItem //
                icon='mdiContentCopy'
                onClick={(e) => img.copyToClipboard()}
                label='Clipboard'
            />
            <MenuItem //
                icon='mdiContentCopy'
                onClick={img.copyToClipboardAsBase64}
                label='Copy Base64'
            />
            <MenuItem
                icon='mdiOverscan'
                disabled={!img?.absPath}
                onClick={() => st.layout.open('Image', { imageID: img.id })}
                localShortcut='mod+click'
                label='Dedicated Panel'
            />
            <MenuItem
                icon='mdiFocusAuto'
                disabled={!img?.absPath}
                localShortcut='shift+click'
                onClick={() => st.layout.open('Canvas', { imgID: img.id })}
                label='Unified Canvas'
            />
            <MenuItem
                icon='mdiBrush'
                disabled={!img?.absPath}
                localShortcut='alt+click'
                onClick={() => st.layout.open('Paint', { imgID: img.id })}
                label='MiniPaint'
            />

            <div className='divider my-1'>FileSystem</div>
            <MenuItem
                icon='mdiStarShooting'
                iconClassName='[color:gold]'
                disabled={!st.getConfigValue('favoriteLocalFolderPath') || st.getConfigValue('favoriteLocalFolderPath') === ''}
                onClick={() => {
                    if (!img || !st.getConfigValue('favoriteLocalFolderPath')) return
                    return img.saveLocally(st.getConfigValue('favoriteLocalFolderPath') ?? '')
                }}
                label={ImagePathUIString(st.getConfigValue('favoriteLocalFolderPath'))}
            />
            <MenuItem
                icon='mdiFolder'
                disabled={!img?.absPath}
                onClick={() => {
                    if (!img?.absPath) return
                    return showItemInFolder(img.absPath)
                }}
                label='Open folder'
            />
            {/* 3. OPEN FILE ITSELF */}
            <MenuItem
                icon='mdiFile'
                disabled={!img?.absPath}
                onClick={() => {
                    const imgPathWithFileProtocol = img ? `file://${img.absPath}` : null
                    if (imgPathWithFileProtocol == null) return
                    return openExternal(imgPathWithFileProtocol)
                }}
                label='Open'
            />
            <MenuItem.Divider children='Draft' />
            <MenuItem //
                icon='mdiPin'
                className='_MenuItem'
                onClick={() => img.useAsDraftIllustration()}
                label='Use as Draft Illustration'
            />
            <MenuItem
                icon='mdiOpenInApp'
                disabled={img.step == null}
                onClick={() => {
                    if (img.step == null) return
                    cushy.layout.open('Output', { stepID: img.step.id })
                }}
                label='Open Step'
            />
            <MenuItem.Divider />
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
                        {app.drafts.map((draft) => (
                            <MenuItem
                                icon='mdiPlay'
                                key={draft.id}
                                className='_MenuItem'
                                onClick={() => {
                                    draft.start({ context: { image: img } })
                                }}
                                iconJSX={<DraftIllustrationUI draft={draft} size='1.2rem' />}
                                label={draft.name}
                            >
                                <div className='flex flex-1 items-center gap-2'>
                                    {draft.name}
                                    <Button
                                        square
                                        icon='mdiOpenInNew'
                                        onClick={(ev) => {
                                            ev.stopPropagation()
                                            ev.preventDefault()
                                            draft.openOrFocusTab()
                                        }}
                                    />
                                    <div className='line ml-auto'>
                                        <div tw='italic opacity-55'>({draft.app.name})</div>
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
