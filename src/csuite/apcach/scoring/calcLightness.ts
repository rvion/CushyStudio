import { colorToComps } from '../culori-utils/colorToComps'
import { getContrastScoreForObjective } from './getContrastScoreForObjective'
import type { ContrastConfig_PREPARED } from '../contrast/contrastConfig'
import { ColorSpace } from '../types'
import { chromaLimits } from '../utils/chromaLimits'
import { clampColorToSpace } from '../clamp/clampColorToSpace'
import { log } from '../utils/log'
import { signOf } from '../utils/misc'
import { lightnessAndPatch } from '../light/lightnessAndPatch'
import type { Oklch } from 'culori'

/** 🟢 one of the main function ! */
export function calcLightness(
    //
    contrastConfig: ContrastConfig_PREPARED,
    chroma: number,
    hue: number,
    colorSpace: ColorSpace,
): number {
    // log(
    //   "CALC LIGHNTESS chroma: " +
    //     chroma +
    //     " colorSpace: " +
    //     colorSpace +
    //     " contrastConfig: " +
    //     JSON.stringify(contrastConfig)
    // );
    let deltaContrast = 0
    let { lightness, lightnessPatch } = lightnessAndPatch(contrastConfig)
    let factContrast = 1000
    let factLightness = 0
    let iteration = 0
    let lightnessFound = false
    let chromaRange = chromaLimits(contrastConfig)
    let searchWindow = { low: 0, top: 1 }

    while (!lightnessFound && iteration < 20) {
        iteration++
        log('--- ITERATION: ' + iteration)
        // Calc new lightness to check
        let newLightness = lightness
        if (iteration > 1) {
            newLightness += lightnessPatch
        }

        // Cap new lightness
        newLightness = Math.max(Math.min(newLightness, chromaRange.upper), chromaRange.lower)

        // Compose color with the lightness to check
        // ❌ let checkingColor = 'oklch(' + newLightness + ' ' + chroma + ' ' + hue + ')'
        let checkingColor: Oklch = { mode: 'oklch', l: newLightness, c: chroma, h: hue }

        let checkingColorClamped = clampColorToSpace(checkingColor, colorSpace)

        let checkingColorComps = colorToComps(checkingColorClamped, contrastConfig.contrastModel, colorSpace)

        // Calculate contrast of this color
        let calcedContrast = getContrastScoreForObjective(checkingColorComps, contrastConfig, colorSpace)
        let newDeltaContrast = contrastConfig.cr - calcedContrast

        // Check for edge case
        if (
            iteration === 1 &&
            calcedContrast < contrastConfig.cr &&
            contrastConfig.searchDirection !== 'auto'
        ) {
            factLightness = lightness
            lightnessFound = true
        }

        // log(
        //   "- CR wanted: " +
        //     contrastConfig.cr +
        //     " fact: " +
        //     calcedContrast +
        //     " delta: " +
        //     newDeltaContrast +
        //     " /// LIGHTNESS old: " +
        //     lightness +
        //     " patch: " +
        //     lightnessPatch +
        //     " new: " +
        //     newLightness +
        //     " in color space? " +
        //     inGamut(colorSpace === "p3" ? "p3" : "rgb")(checkingColor)
        // );
        // Save valid lightness–the one giving fact contrast higher than the desired one
        // It's needed to avoid returning lightness that gives contrast lower than the requested
        if (calcedContrast >= contrastConfig.cr && calcedContrast < factContrast) {
            factContrast = calcedContrast
            factLightness = newLightness
            // log(
            //   "+ lightness saved: " + factLightness + " contrast: " + calcedContrast
            // );
        }

        // Flip the search Patch
        if (deltaContrast !== 0 && signOf(newDeltaContrast) !== signOf(deltaContrast)) {
            // log("----- lightnessPatch switch");
            if (lightnessPatch > 0) {
                searchWindow.top = newLightness
            } else {
                searchWindow.low = newLightness
            }
            // log("searchWindow: " + searchWindow.low + " / " + searchWindow.top);
            lightnessPatch = -lightnessPatch / 2
        } else if (
            newLightness + lightnessPatch === searchWindow.low ||
            newLightness + lightnessPatch === searchWindow.top
        ) {
            // log("----- lightnessPatch / 2");
            lightnessPatch = lightnessPatch / 2
        }

        // Check if the lightness is found
        if (
            searchWindow.top - searchWindow.low < 0.001 || //
            (iteration > 1 && newLightness === lightness)
        ) {
            lightnessFound = true
        }

        // Save valid chroma and deltacontrast
        deltaContrast = newDeltaContrast

        lightness = newLightness
    }
    // log(
    //   "LIGHTNESS FOUND in " +
    //     iteration +
    //     " iterations. Chroma " +
    //     chroma +
    //     " lightness " +
    //     factLightness +
    //     " contrast: " +
    //     factContrast +
    //     " wanted: " +
    //     contrastConfig.cr +
    //     " lightnessPatch: " +
    //     lightnessPatch
    // );
    return Math.min(Math.max(factLightness, 0), 100)
}
