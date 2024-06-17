import { TO_FIND, type ContrastConfig } from '../contrast/contrastConfig'
import type { Oklch } from 'culori'

import { log } from '../utils/log'
import { convertToOklch_orNull } from '../culori-utils/culoriUtils'

export function lightnessFromAntagonist(contrastConfig: ContrastConfig) {
    const antagonist: Oklch =
        contrastConfig.fgColor === TO_FIND //
            ? (contrastConfig.bgColor as Oklch)
            : contrastConfig.fgColor

    log('culori > convertToOklch /// lightnessFromAntagonist')
    const oklch: Oklch | undefined = convertToOklch_orNull(antagonist)
    if (!oklch) throw new Error('Could not convert to oklch')

    return oklch.l
}
