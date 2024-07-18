import type { Field_number } from './FieldNumber'

import { observer } from 'mobx-react-lite'

import { InputNumberUI } from '../../input-number/InputNumberUI'

export const WidgetNumberUI = observer(function WidgetNumberUI_(p: {
    //
    field: Field_number
}) {
    const field = p.field
    const value = field.serial.value
    const mode = field.config.mode
    const step = field.config.step ?? (mode === 'int' ? 1 : 0.1)

    return (
        <InputNumberUI
            mode={mode}
            value={value}
            hideSlider={field.config.hideSlider}
            max={field.config.max}
            min={field.config.min}
            softMin={field.config.softMin}
            softMax={field.config.softMax}
            step={step}
            suffix={field.config.suffix}
            text={field.config.text}
            onValueChange={(next) => (field.value = next)}
            forceSnap={field.config.forceSnap}
        />
    )
})
