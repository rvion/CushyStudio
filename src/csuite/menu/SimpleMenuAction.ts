import type { IconName } from '../icons/icons'

/**
 * a simple Menu entry for when you don't want to resort to commands nor custom widgets
 * label will be used for shortcut binding and fuzzy menu search
 */
export class SimpleMenuAction {
    constructor(
        public opts: {
            label: string
            icon?: IconName
            disabled?: boolean | (() => boolean)
            onPick: () => void
            // preffered shortcut
        },
    ) {}
}
