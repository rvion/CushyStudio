import type { Field } from '../../csuite/model/Field'
import type { Presenter } from '../presenters/Presenter'
import type { PresenterSlots } from '../presenters/PresenterSlots'

import { observer } from 'mobx-react-lite'

import { WidgetHeaderContainerUI } from '../../csuite/form/WidgetHeaderContainerUI'
import { Frame } from '../../csuite/frame/Frame'
import { AnimatedSizeUI } from '../../csuite/smooth-size/AnimatedSizeUI'

export const FieldPresenterMobileUI = observer(function FieldPresenterMobile(
    p: {
        //
        presenter: Presenter
        field: Field
    } & PresenterSlots,
) {
    const { field, presenter } = p
    if (p.field.isHidden && !p.showHidden?.()) return null

    const WUI = (
        <Frame
            className={p.className}
            tw={['UI-WidgetWithLabel !border-l-0 !border-r-0 !border-b-0']}
            base={field.background}
            border={field.border}
            {...p.field.config.box}
        >
            {/* HEADER --------------------------------------------------------------------------------- */}
            <WidgetHeaderContainerUI field={field}>
                {p.Indent && <p.Indent tw='pr-2' depth={field.depth} />}
                <div tw='flex-1'>
                    <div tw='flex flex-1'>
                        {p.DragKnob && <p.DragKnob />}
                        {p.Caret && <p.Caret placeholder={false} field={field} />}
                        {p.Icon && <p.Icon field={field} tw='mr-1' />}
                        {p.LabelText && <p.LabelText field={field} />}
                        {p.DebugID && <p.DebugID field={field} />}
                        {p.Presets && <p.Presets field={field} />}
                    </div>
                    <div tw='flex flex-1'>
                        {p.Toogle && <p.Toogle field={field} />}
                        {p.Header && p.ContainerForHeader && (
                            <p.ContainerForHeader
                                tw={[p.classNameAroundBodyAndHeader, p.classNameAroundBodyAndHeader]}
                                field={field}
                            >
                                <p.Header field={field} />
                            </p.ContainerForHeader>
                        )}
                    </div>
                </div>
            </WidgetHeaderContainerUI>

            {/* BODY  ------------------------------------------------------------------------------ */}
            {p.Body && p.ContainerForBody && (
                <p.ContainerForBody //
                    className={p.classNameAroundBodyAndHeader}
                    children={<p.Body field={field} />}
                />
            )}

            {/* ERRORS  ------------------------------------------------------------------------------ */}
            {p.Errors && <p.Errors field={field} />}
        </Frame>
    )

    if (field.animateResize && p.Body != null) return <AnimatedSizeUI>{WUI}</AnimatedSizeUI>
    return WUI
})
