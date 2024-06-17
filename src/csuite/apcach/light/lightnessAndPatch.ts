import { type ContrastConfig_PREPARED } from '../contrast/contrastConfig'
import { convertToOklch_orThrow } from '../culori-utils/culoriUtils'
import { log } from '../utils/log'

export function lightnessAndPatch(contrastConfig: ContrastConfig_PREPARED) {
    let antagonistLightness = convertToOklch_orThrow(contrastConfig.colorAntagonist).l
    log('culori > convertToOklch /// lightnessAndPatch')
    let lightness
    let lightnessPatch

    switch (contrastConfig.searchDirection) {
        case 'auto': {
            if (antagonistLightness < 0.5) {
                lightnessPatch = (1 - antagonistLightness) / -2
                lightness = 1
            } else {
                lightnessPatch = antagonistLightness / 2
                lightness = 0
            }
            break
        }
        case 'lighter': {
            lightness = 1
            lightnessPatch = (antagonistLightness - lightness) / 2
            break
        }
        case 'darker': {
            lightness = 0
            lightnessPatch = (antagonistLightness - lightness) / 2
            break
        }
        default:
            throw new Error("Invalid lightness search region. Supported values: 'auto', 'lighter', 'darker'")
    }

    return { lightness, lightnessPatch }
}
