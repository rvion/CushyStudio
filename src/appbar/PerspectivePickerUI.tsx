import { observer } from 'mobx-react-lite'

import { Button } from '../csuite/button/Button'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { Frame, type FrameProps } from '../csuite/frame/Frame'
import { InputStringUI } from '../csuite/input-string/InputStringUI'
import { RevealUI } from '../csuite/reveal/RevealUI'

export const PerspectivePickerUI = observer(function PerspectivePicker(p: FrameProps) {
    const perspectives = cushy.db.perspective.all
    return (
        <Frame row {...p}>
            {perspectives.map((p) => (
                <RevealUI
                    key={p.id}
                    trigger={'rightClick'}
                    content={() => (
                        <>
                            <MenuItem
                                onClick={() =>
                                    cushy.startActivity({
                                        backdrop: true,
                                        stopOnBackdropClick: true,
                                        UI: () => (
                                            <InputStringUI //
                                                getValue={() => p.data.name ?? '<untitled>'}
                                                setValue={(v) => p.update({ name: v })}
                                            />
                                        ),
                                    })
                                }
                                icon='mdiTagEdit'
                                children='Rename'
                            />
                            <MenuItem onClick={() => p.saveSnapshot()} icon='mdiZipDisk' children='save' />
                            <MenuItem onClick={() => p.resetToSnapshot()} icon='mdiLockReset' children='Reset To Last Save' />
                            <MenuItem onClick={() => p.resetToDefault()} icon='mdiRestore' children='Reset To Default' />
                            <MenuItem onClick={() => p.duplicate()} icon='mdiClipboard' children='Duplicate' />
                            <MenuItem onClick={() => p.delete()} icon='mdiTrashCan' children='Delete' />
                        </>
                    )}
                >
                    <Button //
                        look={p.isActive ? 'primary' : undefined}
                        children={p.data.name}
                        onClick={() => p.open()}
                    />
                </RevealUI>
            ))}
            <Button //
                icon='mdiPlus'
                onClick={() => cushy.db.perspective.getOrCreate(`p${Date.now()}`)}
            />
        </Frame>
    )
})
