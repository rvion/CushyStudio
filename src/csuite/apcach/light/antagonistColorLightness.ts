import type { ContrastConfig_PREPARED } from '../contrast/contrastConfig'

import { convertToOklch_orThrow } from '../culori-utils/culoriUtils'
import { log } from '../utils/log'

export function antagonistColorLightness(contrastConfig: ContrastConfig_PREPARED) {
    let oklch = convertToOklch_orThrow(contrastConfig.colorAntagonist)
    log('culori > convertToOklch /// antagonistColorLightness')
    return oklch.l
}
