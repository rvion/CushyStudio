import { observer } from 'mobx-react-lite'

import { Ikon } from '../../icons/iconHelpers'
import { Frame } from '../frame/Frame'

export const InputBoolToggleButtonBoxUI = observer(function InputBoolToggleButtonBoxUI_(p: {
    //
    mode: 'radio' | 'checkbox'
    isActive: boolean
}) {
    const { mode, isActive } = p
    const chroma = isActive ? 0.08 : 0.02
    return (
        <div>
            <Frame text={{ contrast: 0.8, chroma: isActive ? 0.15 : chroma }}>
                {mode === 'radio' ? (
                    isActive ? (
                        <Ikon.mdiCheckCircle />
                    ) : (
                        <Ikon.mdiCircleOutline />
                    )
                ) : mode === 'checkbox' ? (
                    isActive ? (
                        <Ikon.mdiCheckboxMarked />
                    ) : (
                        <Ikon.mdiCheckboxBlankOutline />
                    )
                ) : null}
            </Frame>
        </div>
    )
})
