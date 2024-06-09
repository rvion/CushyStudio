import type { Form } from '../../controls/Form'

import { observer } from 'mobx-react-lite'

import { FormUI } from '../../controls/FormUI'
import { Button } from '../../csuite/button/Button'
import { Ikon } from '../../csuite/icons/iconHelpers'
import { RevealUI } from '../../csuite/reveal/RevealUI'

export const FormAsDropdownConfigUI = observer(function FormAsDropdownConfigUI_(p: {
    form?: Form<any>
    children?: React.ReactNode
    title?: string
    className?: string
    maxWidth?: string
    minWidth?: string
    width?: string
}) {
    return (
        <RevealUI
            title={p.title}
            className={p.className}
            content={() => (
                <div //
                    tw='flex-none'
                    style={{
                        // maxWidth: p.maxWidth ?? '500px',
                        maxWidth: p.maxWidth,
                        minWidth: p.minWidth,
                        width: p.width,
                    }}
                >
                    {p.form && <FormUI form={p.form} />}
                    {p.children}
                </div>
            )}
        >
            <Button size='input' tw='!gap-0'>
                <Ikon.mdiCog />
                <Ikon.mdiChevronDown />
            </Button>
        </RevealUI>
    )
})
