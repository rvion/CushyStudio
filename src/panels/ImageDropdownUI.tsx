import { observer } from 'mobx-react-lite'
import { showItemInFolder, openExternal } from 'src/app/layout/openExternal'
import { ComboUI } from 'src/app/shortcuts/ComboUI'
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
                icon={<span className='material-symbols-outlined'>settings_overscan</span>}
                disabled={!img?.absPath}
                onClick={() => st.layout.FOCUS_OR_CREATE('Image', { imageID: img.id })}
                shortcut={<ComboUI combo='ctrl+click' />}
            >
                Open in dedicated panel (ctrl+click)
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>center_focus_weak</span>}
                disabled={!img?.absPath}
                shortcut={<ComboUI combo='shift+click' />}
                onClick={() => st.layout.FOCUS_OR_CREATE('Canvas', { imgID: img.id })}
            >
                start unified Canvas (shift+click)
            </MenuItem>
            <MenuItem
                icon={<span className='material-symbols-outlined'>center_focus_weak</span>}
                disabled={!img?.absPath}
                shortcut={<ComboUI combo='alt+click' />}
                onClick={() => st.layout.FOCUS_OR_CREATE('Paint', { imgID: img.id })}
            >
                Paint with MiniPaint (alt+click)
            </MenuItem>

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
            {st.favoriteApps.map((appID) => {
                const app = st.db.cushy_apps.get(appID)
                if (app == null) return <>app {appID} not found</>
                if (app.executable == null) return <>app {app.name} has no executable</>
                if (!app.executable.canBeStartedFromImage) return null
                return (
                    <div key={app.id}>
                        {app.drafts.map((d) => (
                            <div
                                tw='btn btn-sm'
                                onClick={() => {
                                    d.AWAKE()
                                    st.layout.FOCUS_OR_CREATE('Output', {})
                                    d.start(null, img)
                                }}
                                key={d.id}
                            >
                                start {d.name}
                            </div>
                        ))}
                    </div>
                )
            })}
        </>
    )
})
