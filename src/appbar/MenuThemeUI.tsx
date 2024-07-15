import { observer } from 'mobx-react-lite'

import { Dropdown } from '../csuite/dropdown/Dropdown'
import { useSt } from '../state/stateContext'

export const MenuThemeUI = observer(function MenuThemeUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            // startIcon={<span className='material-symbols-outlined'>color_lens</span>}
            title='Theme'
            content={() => <div tw='[width:38rem]'>{cushy.theme.render()}</div>}
        />
    )
})
