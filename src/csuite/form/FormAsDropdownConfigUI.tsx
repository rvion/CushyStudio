import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { Button } from '../button/Button'
import { Ikon } from '../icons/iconHelpers'
import { RevealUI } from '../reveal/RevealUI'
import { FormUI } from './FormUI'

export const FormAsDropdownConfigUI = observer(function FormAsDropdownConfigUI_(p: {
    form?: Field<any>
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
                    {p.form && <FormUI field={p.form} />}
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
