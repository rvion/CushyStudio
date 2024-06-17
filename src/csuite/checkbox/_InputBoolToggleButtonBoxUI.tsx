import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'
import { Ikon } from '../icons/iconHelpers'

export const InputBoolToggleButtonBoxUI = observer(function InputBoolToggleButtonBoxUI_(p: {
    //
    mode: 'radio' | 'checkbox' | false
    isActive: boolean
}) {
    const { mode, isActive } = p
    const chroma = isActive ? 0.08 : 0.02
    return (
        <div>
            <Frame tw='text-lg mr-1' text={{ contrast: 0.3, chroma: isActive ? 0.15 : chroma }}>
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
