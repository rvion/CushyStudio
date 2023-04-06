import { Badge, Button, ButtonToolbar, IconButton, Whisper } from 'rsuite'
import { observer } from 'mobx-react-lite'

import * as I from '@rsuite/icons'
import * as dialog from '@tauri-apps/api/dialog'
import * as fs from '@tauri-apps/api/fs'
import { ImportCandidate } from '../importers/ImportCandidate'
import { WorkspaceToolbarUI } from '../ui/ToolbarUI'
import { useWorkspace } from '../ui/WorkspaceContext'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const client = useWorkspace()
    return (
        <ButtonToolbar>
            <Badge color='orange' content={`(REALLY) ALPHA`} />
            <WorkspaceToolbarUI />
            {/* <ToolbarButton aria-label='Increase Font Size' appearance='primary' icon={<FontIncrease24Regular />} /> */}
            <IconButton
                size='sm'
                icon={<I.Import />}
                onClick={async () => {
                    console.log('[📁] opening dialog')
                    const RAW = await dialog.open({
                        title: 'Open',
                        defaultPath: `$HOME`,
                        multiple: true,
                        // 2023-04-02: rvion: let's not filter for now
                        // filters: [
                        //     //
                        //     { name: 'Civitai Project', extensions: ['cushy'] },
                        //     { name: 'image', extensions: ['png'] },
                        // ],
                    })

                    if (RAW == null) return console.log('❌ no file selected')

                    const filePaths = Array.isArray(RAW) ? RAW : [RAW]
                    for (const filePath of filePaths) {
                        if (typeof filePath !== 'string') return console.log('❌ not a string:', filePath)
                        console.log('[📁] reading content of', filePath)
                        const content = await fs.readBinaryFile(filePath)
                        const file = new File([content], filePath, { type: 'image/png' })
                        client.importQueue.push(new ImportCandidate(client, file))
                    }

                    // const metadata = await getPngMetadata(client, file)
                    // console.log('[📁] content', metadata)
                    // layout.addHelpPopup()
                }}
            >
                Import
            </IconButton>
            {/* <ToolbarButton aria-label='Decrease Font Size' icon={<FontDecrease24Regular />} /> */}
        </ButtonToolbar>
    )
})
