import type { FrameAppearance } from '../frame/FrameTemplates'
import type { IconName } from '../icons/icons'
import type { RevealProps } from '../reveal/RevealProps'
import type { ReactNode } from 'react'

import { Button } from '../../csuite/button/Button'
import { RevealUI } from '../reveal/RevealUI'
import { FormUI, FormUIProps } from './FormUI'

/** free structure */

export type FormRenderProps = Omit<FormUIProps, 'field'>

export class Form {
    constructor(public props: FormUIProps) {}

    render(p?: FormRenderProps): JSX.Element {
        return <FormUI {...this.props} {...p} />
    }

    asModal(p?: {
        //
        label?: ReactNode
        icon?: IconName
        title?: string
        shouldClose?: boolean
        look?: FrameAppearance
        // 🔴 This current API doesn't really allow state management depending on
        // the modal's open and close states
        // This is problematic for callers which can't would want fresh states on each open for instance
        // Hooking to onRevealed for now...
        onRevealed?: RevealProps['onRevealed']
    }): JSX.Element {
        const labelText = typeof p?.label === 'string' ? p.label : p?.label == null ? 'Cliquez ici 🔶' : null
        const { title, label, ...rest } = p ?? {}
        return (
            <RevealUI
                shell='popup-lg'
                placement='screen-top'
                title={p?.title}
                onRevealed={p?.onRevealed}
                content={(pp) => {
                    // 🔶 todo: add modal title via p.title
                    return this.render({
                        className: 'min-w-[600px]',
                        ...rest,
                        submitAction:
                            this.props.submitAction == null
                                ? undefined
                                : async (x) => {
                                      if (this.props.submitAction == null) return
                                      if (this.props.submitAction === 'confetti') {
                                          // @ts-ignore
                                          const fire = (await import('https://cdn.skypack.dev/canvas-confetti')).default as (
                                              p: any,
                                          ) => void
                                          fire({ zIndex: 100000, particleCount: 100, spread: 70 })
                                      } else this.props.submitAction(x)

                                      if (p?.shouldClose !== false) pp.reveal.close('closeButton')
                                  },
                    })
                }}
            >
                {labelText != null ? ( // 🔴 this is annoying, we just want to use our button.
                    <Button look={p?.look} icon={p?.icon}>
                        {p?.label ?? 'Cliquez ici 🔶'}
                    </Button>
                ) : (
                    p?.label
                )}
            </RevealUI>
        )
    }
}
