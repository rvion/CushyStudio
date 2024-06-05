import type { Form } from '../../controls/Form'

import { observer } from 'mobx-react-lite'

import { FormUI } from '../../controls/FormUI'
import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { Ikon } from '../../icons/iconHelpers'

export const FormAsDropdownConfigUI = observer(function FormAsDropdownConfigUI_(p: {
    //
    title?: string
    form: Form<any>
}) {
    return (
        <RevealUI
            title={p.title}
            content={() => (
                <div style={{ width: '500px' }} tw='flex-shrink-0'>
                    <FormUI form={p.form} />
                </div>
            )}
        >
            <Button size='input'>
                <Ikon.mdiCog />
                <Ikon.mdiChevronDown />
            </Button>
        </RevealUI>
    )
})
