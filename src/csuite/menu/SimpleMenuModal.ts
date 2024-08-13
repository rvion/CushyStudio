import type { IconName } from '../icons/icons'
import type { FC } from 'react'

/**
 * a simple Menu entry that open a popup for when you don't want to resort to commands nor custom widgets
 * label will be used for shortcut binding and fuzzy menu search
 */
export class SimpleMenuModal {
    constructor(
        public p: {
            label: string
            icon?: IconName
            submit?: () => void
            submitLabel?: string
            UI: FC<{
                /** will be called both when submitted and not */
                close: (p: { didSubmit?: boolean }) => void
                /** if present, a submit button will be added */
                submit?: () => void
                /** only taken into account if submit function is also given */
                submitLabel?: string
            }>
        },
    ) {}
}
