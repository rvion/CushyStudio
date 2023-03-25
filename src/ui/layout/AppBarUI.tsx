import { Badge, Button, Menu, MenuTrigger, Toolbar, ToolbarButton } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'

import * as I from '@fluentui/react-icons'
import * as dialog from '@tauri-apps/api/dialog'
import * as fs from '@tauri-apps/api/fs'
import { useSt } from '../stContext'
import { ToolbarUI } from '../ToolbarUI'

export const AppBarUI = observer(function AppBarUI_(p: {}) {
    const client = useSt()
    return (
        <Toolbar>
            <Badge appearance='filled' color='warning'>
                ALPHA
            </Badge>
            <ToolbarUI />
            {/* <ToolbarButton aria-label='Increase Font Size' appearance='primary' icon={<FontIncrease24Regular />} /> */}
            <ToolbarButton icon={<I.New24Filled />}>New</ToolbarButton>
            <ToolbarButton icon={<I.Save24Filled />}>Save</ToolbarButton>
            <ToolbarButton
                onClick={async () => {
                    console.log('[📁] opening dialog')
                    const filePath = await dialog.open({
                        title: 'Open',
                        defaultPath: `~`,
                        filters: [
                            //
                            { name: 'Civitai Project', extensions: ['cushy'] },
                            { name: 'image', extensions: ['png'] },
                        ],
                    })
                    if (typeof filePath !== 'string') return console.log('❌ not a string:', filePath)
                    console.log('[📁] reading content of', filePath)
                    const content = await fs.readBinaryFile(filePath)
                    const file = new File([content], filePath, { type: 'image/png' })
                    client.handleFile(file)

                    // const metadata = await getPngMetadata(client, file)
                    // console.log('[📁] content', metadata)
                    // layout.addHelpPopup()
                }}
            >
                Open
            </ToolbarButton>
            {/* <ToolbarButton aria-label='Decrease Font Size' icon={<FontDecrease24Regular />} /> */}
            <Menu>
                <MenuTrigger disableButtonEnhancement>
                    <Button>Fichier</Button>
                </MenuTrigger>

                {/* <MenuPopover>
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                dialog.open({
                                    title: 'Open',
                                    defaultPath: `~`,
                                    filters: [
                                        //
                                        { name: 'Civitai Project', extensions: ['cushy'] },
                                    ],
                                })
                                // layout.addHelpPopup()
                            }}
                        >
                            Open
                        </MenuItem>
                        <MenuItem>New Project</MenuItem>
                        <MenuItem icon={<I.Save24Regular />}>Save</MenuItem>
                    </MenuList>
                </MenuPopover> */}
            </Menu>
        </Toolbar>
    )
})
