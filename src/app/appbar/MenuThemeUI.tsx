import { observer } from 'mobx-react-lite'

import { Dropdown } from '../../rsuite/dropdown/Dropdown'
import { useSt } from '../../state/stateContext'
import { ThemePreviewUI } from './utils/ThemePreviewUI'

export const MenuThemeUI = observer(function MenuThemeUI_(p: {}) {
    const st = useSt()
    return (
        <Dropdown
            // startIcon={<span className='material-symbols-outlined'>color_lens</span>}
            title='Theme'
            content={() => (
                <>
                    {st.themeMgr.themes.map((theme) => (
                        <div
                            tw='cursor-pointer'
                            key={theme}
                            onClick={(ev) => {
                                ev.preventDefault()
                                ev.stopPropagation()
                                st.themeMgr.theme = theme
                            }}
                        >
                            <ThemePreviewUI theme={theme} />
                        </div>
                    ))}
                </>
            )}
        />
    )
})
