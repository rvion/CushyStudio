import { Button } from '../button/Button'
import { InputBoolCheckboxUI } from '../checkbox/InputBoolCheckboxUI'
import { ToggleButtonUI } from '../checkbox/InputBoolToggleButtonUI'
import { Dropdown } from '../dropdown/Dropdown'
import { Frame } from '../frame/Frame'
import { PanelUI } from '../panel/PanelUI'
import { BasicShelfUI } from '../shelf/ShelfUI'

export const UI = {
    Frame: Frame,
    Button: Button,
    Panel: PanelUI,
    Shelf: BasicShelfUI,
    Checkbox: InputBoolCheckboxUI,
    ToogleButton: ToggleButtonUI,
    Dropdown: Dropdown,
}
