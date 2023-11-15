import { Popover, Dropdown, Button, Whisper, DropdownMenu, DropdownItem } from 'src/rsuite/shims'

export const PrompterConfigUI = () => (
    <Whisper placement='bottomStart' trigger='click' speaker={renderMenu}>
        <Button size='xs' icon={<span className='material-symbols-outlined'>settings_input_component</span>} />
    </Whisper>
)

const renderMenu = ({ onClose, left, top, className }: RsuiteRenderMenuProps, ref: React.RefCallback<HTMLElement>) => {
    const handleSelect = (eventKey: Maybe<string>) => {
        onClose()
        console.log(eventKey)
    }
    return (
        <Popover ref={ref} className={className} style={{ left, top }} full>
            <DropdownMenu onSelect={handleSelect}>
                <DropdownMenu title='New File'>
                    <DropdownItem eventKey={1}>New File</DropdownItem>
                    <DropdownItem eventKey={2}>New File with Current Profile</DropdownItem>
                </DropdownMenu>
                <DropdownItem eventKey={3}>Download As...</DropdownItem>
                <DropdownItem eventKey={4}>Export PDF</DropdownItem>
                <DropdownItem eventKey={5}>Export HTML</DropdownItem>
                <DropdownItem eventKey={6}>Settings</DropdownItem>
                <DropdownItem eventKey={7}>About</DropdownItem>
            </DropdownMenu>
        </Popover>
    )
}

import { RsuiteRenderMenuProps } from './RsuiteRenderMenuProps'
