import type { ComfyImageInfo } from '../types/ComfyWsApi'

export type ImageInfos_ComfyGenerated = {
    comfyHostHttpURL: string
    comfyImageInfo: ComfyImageInfo
}

export const getComfyURLFromImageInfos = (infos: ImageInfos_ComfyGenerated) => {
    return infos.comfyHostHttpURL + '/view?' + new URLSearchParams(infos.comfyImageInfo).toString()
}

export const checkIfComfyImageExists = async (
    comfyHostHttpURL: string,
    imageInfo: { type: `input` | `ouput`; subfolder: string; filename: string },
): Promise<boolean> => {
    try {
        const url = getComfyURLFromImageInfos({ comfyHostHttpURL, comfyImageInfo: imageInfo })
        console.log(`checkIfComfyImageExists`, { url })
        const result = await fetch(url, { method: `HEAD` })
        console.log(`checkIfComfyImageExists result`, { url, result })
        return result.ok
    } catch {
        return false
    }
}
