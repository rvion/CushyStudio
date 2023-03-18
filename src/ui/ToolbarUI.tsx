import {
    Toolbar,
    ToolbarButton,
    ToolbarDivider,
    Menu,
    MenuTrigger,
    MenuPopover,
    MenuList,
    MenuItem,
    ToolbarProps,
} from '@fluentui/react-components'
import * as I from '@fluentui/react-icons'
import { observer } from 'mobx-react-lite'
import { useSt } from './stContext'

export const ToolbarUI = observer(function ToolbarUI_(props: Partial<ToolbarProps>) {
    const client = useSt()
    const project = client.project
    return (
        <Toolbar aria-label='Default' {...props}>
            <ToolbarButton
                aria-label='Increase Font Size'
                appearance='primary'
                icon={<I.Play24Filled />}
                onClick={() => project.run('real')}
            />
            <ToolbarButton
                aria-label='Decrease Font Size'
                icon={<I.DesktopToolboxRegular />}
                onClick={() => project.run('fake')}
            />
            <ToolbarButton aria-label='Reset Font Size' icon={<I.TextFont24Regular />} />
            <ToolbarDivider />
            <Menu>
                <MenuTrigger>
                    <ToolbarButton aria-label='More' icon={<I.MoreHorizontal24Filled />} />
                </MenuTrigger>

                <MenuPopover>
                    <MenuList>
                        <MenuItem>New </MenuItem>
                        <MenuItem>New Window</MenuItem>
                        <MenuItem disabled>Open File</MenuItem>
                        <MenuItem>Open Folder</MenuItem>
                    </MenuList>
                </MenuPopover>
            </Menu>
        </Toolbar>
    )
})
