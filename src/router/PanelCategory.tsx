import type { IconName } from '../csuite/icons/icons'

import { exhaust } from '../csuite/utils/exhaust'

// prettier-ignore
export type PanelCategory =
    | 'app' // everything related to running CushyStudio apps
    | 'outputs' // everything related to viewing generated content
    | 'settings' // everything related to settings / configuration
    | 'ComfyUI'
    | 'models'
    | 'tools'
    | 'help'
    | 'misc'
    | 'developper'

export function getPanelCategoryIcon(x: PanelCategory): IconName {
    if (x === 'app') return 'mdiApps'
    if (x === 'outputs') return 'mdiFileDocument'
    if (x === 'settings') return 'mdiCog'
    if (x === 'ComfyUI') return 'cdiNodes'
    if (x === 'models') return 'mdiDatabase'
    if (x === 'tools') return 'mdiWrench'
    if (x === 'help') return 'mdiHelpCircle'
    if (x === 'misc') return 'mdiDotsHorizontal'
    if (x === 'developper') return 'mdiCodeBraces'
    exhaust(x)
    return 'mdiBatteryUnknown'
}
