import { Popover, Dropdown, IconButton, Whisper } from 'rsuite'

export const PrompterConfigUI = () => (
    <Whisper placement='bottomStart' trigger='click' speaker={renderMenu}>
        <IconButton size='xs' icon={<span className='material-symbols-outlined'>settings_input_component</span>} />
    </Whisper>
)

const renderMenu = ({ onClose, left, top, className }: RsuiteRenderMenuProps, ref: React.RefCallback<HTMLElement>) => {
    const handleSelect = (eventKey: Maybe<string>) => {
        onClose()
        console.log(eventKey)
    }
    return (
        <Popover ref={ref} className={className} style={{ left, top }} full>
            <Dropdown.Menu onSelect={handleSelect}>
                <Dropdown.Menu title='New File'>
                    <Dropdown.Item eventKey={1}>New File</Dropdown.Item>
                    <Dropdown.Item eventKey={2}>New File with Current Profile</Dropdown.Item>
                </Dropdown.Menu>
                <Dropdown.Item eventKey={3}>Download As...</Dropdown.Item>
                <Dropdown.Item eventKey={4}>Export PDF</Dropdown.Item>
                <Dropdown.Item eventKey={5}>Export HTML</Dropdown.Item>
                <Dropdown.Item eventKey={6}>Settings</Dropdown.Item>
                <Dropdown.Item eventKey={7}>About</Dropdown.Item>
            </Dropdown.Menu>
        </Popover>
    )
}

import { RsuiteRenderMenuProps } from './RsuiteRenderMenuProps'
