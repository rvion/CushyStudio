import type { Field } from '../../../csuite/model/Field'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../../csuite/frame/Frame'
import { Ikon } from '../../../csuite/icons/iconHelpers'
import { RevealUI } from '../../../csuite/reveal/RevealUI'

/** default error block */
export const WidgetErrorsUI = observer(function WidgerErrorsUI_(p: { field: Field }) {
    const field = p.field
    if (!field.mustDisplayErrors) return null
    return (
        <Frame
            // tw='text-red-700 -mt-1'
            text={{ hue: 0, contrast: 0.5, chroma: 0.3 }}
            tw='-mt-1'
        >
            {/* {field.pathExt} */}
            {field.ownErrors.map((e, i) => (
                // 🦀 Added `h-input` to make it less ugly, but not sure if it's the right way
                <RevealUI key={i} trigger={'click'} content={() => e.longerMessage ?? 'no extra infos'}>
                    <div tw='flex items-center gap-1'>
                        <Ikon.mdiAlert />
                        {e.message}
                    </div>
                </RevealUI>
            ))}
        </Frame>
    )
})
