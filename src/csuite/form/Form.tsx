import type { FrameAppearance } from '../frame/FrameTemplates'
import type { IconName } from '../icons/icons'

import { Button } from '../../csuite/button/Button'
import { RevealUI } from '../reveal/RevealUI'
import { FormUI, FormUIProps } from './FormUI'

/** free structure */

export class Form {
    constructor(public props: FormUIProps) {}

    render(p?: Omit<FormUIProps, 'field'>): JSX.Element {
        return <FormUI {...this.props} {...p} />
    }

    asModal(p?: {
        //
        label?: string
        icon?: IconName
        title?: string
        shouldClose?: boolean
        look?: FrameAppearance
    }): JSX.Element {
        return (
            <RevealUI
                placement='popup-lg'
                title={p?.title}
                content={(reveal) => {
                    // 🔶 todo: add modal title via p.title
                    return this.render({
                        className: 'min-w-[600px]',
                        ...p,
                        submitAction: async (x) => {
                            if (this.props.submitAction == null) return
                            if (this.props.submitAction === 'confetti') {
                                // @ts-ignore
                                const fire = (await import('https://cdn.skypack.dev/canvas-confetti')).default as (p: any) => void
                                fire({ zIndex: 100000, particleCount: 100, spread: 70 })
                            } else this.props.submitAction(x)

                            if (p?.shouldClose !== false) reveal.close()
                        },
                    })
                }}
            >
                <Button look={p?.look} icon={p?.icon}>
                    {p?.label ?? 'Cliquez ici 🔶'}
                </Button>
            </RevealUI>
        )
    }
}
