import type { Form } from '../../controls/Form'

import { observer } from 'mobx-react-lite'

import { FormUI } from '../../controls/FormUI'
import { Ikon } from '../../icons/iconHelpers'
import { RevealUI } from '../../rsuite/reveal/RevealUI'
import { Box } from '../../theme/colorEngine/Box'

export const FormAsDropdownConfigUI = observer(function FormAsDropdownConfigUI_(p: { title?: string; form: Form<any> }) {
    return (
        <RevealUI
            tw='WIDGET-FIELD'
            title={p.title}
            content={() => (
                <div style={{ width: '500px' }} tw='flex-shrink-0'>
                    <FormUI form={p.form} />
                </div>
            )}
        >
            <Box
                border
                hover
                tw='flex px-1 w-full h-full items-center justify-center hover:brightness-125 border border-base-100'
            >
                <Ikon.mdiCog />
                <Ikon.mdiChevronDown />
            </Box>
        </RevealUI>
    )
})
