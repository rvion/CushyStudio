import type { MediaImageL } from '../../../src/models/MediaImage'
import type { SimpleColor, SimpleKind, SimpleRarity } from './_stsAssets'
import type { TextConfig } from 'konva/lib/shapes/Text'

import { stsAssets } from './_stsAssets'

const cache = new Map()
const memoized = <T extends (...args: any[]) => any>(fn: T) => {
    return (...args: Parameters<T>): ReturnType<T> => {
        const key = JSON.stringify(args)
        if (cache.has(key)) return cache.get(key)
        const result = fn(...args)
        cache.set(key, result)
        return result
    }
}

export const drawCard = async (p: {
    //
    color: SimpleColor
    kind: SimpleKind
    rarity: SimpleRarity
    cost: number | string
    text: string
    name: string
    illustration: MediaImageL
}) => {
    const run = getCurrentRun()
    const Konva = run.Konva
    const layer = Konva.createStageWithLayer({ height: 1024, width: 1024 })
    const mkImage = memoized(async (key: string) => {
        const url = (stsAssets as Record<string, string>)[key]
        if (!url) throw new Error(`missing asset: ${key}`)
        const baseImgDom = await Konva.createHTMLImage_fromURL(url)
        const baseImg = Konva.Image({ image: baseImgDom })
        return baseImg
    })

    layer.add(
        //
        await mkImage(`${p.kind}-${p.color}`),
        (await run.Konva.Image_fromURL(p.illustration.url)).x(265).y(180),
        await mkImage(`rarity-${p.kind}-${p.rarity}`),
        await mkImage(`header-${p.rarity}`),
        (await mkImage(`energy-${p.color}`)).x(128 + 32).y(32),
        new Konva.Konva.Text({ text: p.text, x: 256, y: 512 + 64, width: 512, height: 256, ...descriptionStyle }),
        new Konva.Konva.Text({ text: p.name, x: 256, y: 50, width: 512, height: 256, ...titleStyle }),
        new Konva.Konva.Text({ text: p.cost.toString(), x: 128 + 96, y: 96, ...costStyle }),
    )

    const final = run.Images.createFromDataURL(
        layer.toDataURL({
            x: 150,
            y: 50,
            width: 1024 - 2 * 150,
            height: 1024 - 50,
        }),
    )
    return final
}

const descriptionStyle: TextConfig = {
    fontFamily: 'Times New Roman',
    fontSize: 32,
    fontWeight: 'bold',
    align: 'center',
    verticalAlign: 'middle',
    fill: 'white',
}

const titleStyle: TextConfig = {
    fontFamily: 'Times New Roman',
    fontSize: 50,
    fontWeight: 'bold',
    align: 'center',
    verticalAlign: 'middle',
    fill: 'white',
}

const costStyle: TextConfig = {
    fontFamily: 'Times New Roman',
    fontSize: 60,
    fontWeight: 'bold',
    align: 'center',
    verticalAlign: 'middle',
    fill: 'black',
}
