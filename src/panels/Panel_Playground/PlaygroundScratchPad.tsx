import { observer } from 'mobx-react-lite'

import { CushyErrorBoundarySimpleUI } from '../../controls/shared/CushyErrorBoundarySimple'
import { FormUI } from '../../controls/FormUI'
import { ThemeForm } from '../../theme/CushyTheming'

/** Freely modify this as you like, then pick the "Scratch Pad" option in the top left. Do not commit changes made to this. */
export const PlaygroundScratchPad = observer(function PlaygroundScratchPad_(p: {}) {
    return (
        <CushyErrorBoundarySimpleUI>
            <ThemeConfigUI />
        </CushyErrorBoundarySimpleUI>
    )
})

export const ThemeConfigUI = observer(function ThemeConfigUI_(p: {}) {
    const theme = cushy.themeManager

    return (
        <div tw='w-full h-full bg-base-300 p-1'>
            <FormUI form={ThemeForm} />
        </div>
    )
})
