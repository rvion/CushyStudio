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
   if (x === 'app') return IKONS.mdiApps
   if (x === 'outputs') return IKONS.mdiFileDocument
   if (x === 'settings') return IKONS.mdiCog
   if (x === 'ComfyUI') return IKONS.cdiNodes
   if (x === 'models') return IKONS.mdiDatabase
   if (x === 'tools') return IKONS.mdiWrench
   if (x === 'help') return IKONS.mdiHelpCircle
   if (x === 'misc') return IKONS.mdiDotsHorizontal
   if (x === 'developper') return IKONS.mdiCodeBraces
   exhaust(x)
   return IKONS.mdiBatteryUnknown
}
