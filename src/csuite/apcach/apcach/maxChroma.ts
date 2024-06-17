import type { ColorSpace } from '../types'
import type { ContrastConfig } from '../contrast/contrastConfig'
import { apcach, type Apcach } from './apcach'
import { inColorSpace } from '../culori-utils/inColorSpace'

export type MaxChromaFn = (
    //
    contrastConfig: ContrastConfig,
    hue: number,
    /** 0 to 100 */
    alpha: number,
    colorSpace: ColorSpace,
) => Apcach

export function maxChroma(chromaCap: number = 0.4) {
    return function (
        //
        contrastConfig: ContrastConfig,
        hue: number,
        alpha: number,
        colorSpace: ColorSpace,
    ) {
        let checkingChroma = chromaCap
        let searchPatch = 0.4
        let color!: Apcach
        let colorIsValid = false
        let chromaFound = false
        let iteration = 0

        while (!chromaFound && iteration < 30) {
            iteration++
            let oldChroma = checkingChroma
            let newPatchedChroma = oldChroma + searchPatch
            checkingChroma = Math.max(Math.min(newPatchedChroma, chromaCap), 0)
            color = apcach(
                //
                contrastConfig,
                checkingChroma,
                hue,
                alpha,
                colorSpace,
            )

            // Check if the new color is valid
            let newColorIsValid = inColorSpace(color, colorSpace)
            if (iteration === 1 && !newColorIsValid) {
                searchPatch *= -1
            } else if (newColorIsValid !== colorIsValid) {
                // Over shooot
                searchPatch /= -2
            }
            colorIsValid = newColorIsValid
            if (checkingChroma <= 0 && !colorIsValid) {
                // Contrast is too high, return invalid color
                color.chroma = 0
                return color
            } else if ((Math.abs(searchPatch) <= 0.001 || checkingChroma === chromaCap) && colorIsValid) {
                if (checkingChroma <= 0) {
                    color.chroma = 0
                }
                chromaFound = true
            }
        }
        return color
    }
}
