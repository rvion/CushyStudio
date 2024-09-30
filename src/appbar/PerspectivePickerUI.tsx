import { observer } from 'mobx-react-lite'

import { Button } from '../csuite/button/Button'
import { MenuItem } from '../csuite/dropdown/MenuItem'
import { Frame } from '../csuite/frame/Frame'
import { RevealUI } from '../csuite/reveal/RevealUI'

export const PerspectivePickerUI = observer(function PerspectivePicker(p: {}) {
    const perspectives = cushy.db.perspective.all
    return (
        <Frame row>
            {perspectives.map((p) => (
                <RevealUI
                    key={p.id}
                    trigger={'rightClick'}
                    content={() => (
                        <>
                            <MenuItem onClick={() => p.saveSnapshot()} icon='mdiZipDisk' children='save' />
                            <MenuItem onClick={() => p.resetToSnapshot()} icon='mdiLockReset' children='Reset To Last Save' />
                            <MenuItem onClick={() => p.resetToDefault()} icon='mdiRestore' children='Reset To Default' />
                            <MenuItem onClick={() => p.duplicate()} icon='mdiClipboard' children='Duplicate' />
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
