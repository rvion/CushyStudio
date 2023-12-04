import type { NodeConfig } from 'konva/lib/Node'
import type { ImageAndMask, Runtime } from 'src/back/Runtime'
import { CardSuit, CardSuitPosition, CardValue, getCardLayout } from './_cardLayouts'
import { TextConfig } from 'konva/lib/shapes/Text'

export async function _drawCard(
    //
    flow: Runtime,
    opts: {
        baseUrl: string
        value: CardValue
        suit: CardSuit
        W: number
        H: number
    },
): Promise<{
    base: ImageAndMask
    mask: ImageAndMask
}> {
    const I = await flow.loadImageSDK()
    const { suit, value, W, H } = opts
    const mkImage = () => {
        const container: HTMLDivElement = I.createContainer()
        const stage = new I.Stage({ container: container, width: W, height: H })
        const layer = new I.Layer()
        stage.add(layer)
        return { container, stage, layer }
    }

    const mkDomImage = (src: string): Promise<HTMLImageElement> => {
        const image = new Image()
        image.src = src
        return new Promise((yes, no) => {
            image.onload = () => {
                return yes(image)
            }
        })
        // return image
    }

    // prettier-ignore
    const image = await (() => {
        // return I.loadImage('CushyStudio/default/_assets/symbol-diamond.png')
        if (suit === 'diamonds') return I.loadImage('CushyStudio/default/_assets/symbol-diamond.png')
        if (suit === 'clubs')    return I.loadImage('CushyStudio/default/_assets/symbol-club.png')
        if (suit === 'hearts')   return I.loadImage('CushyStudio/default/_assets/symbol-heart.png')
        if (suit === 'spades')   return I.loadImage('CushyStudio/default/_assets/symbol-spades.png')
        return exhaust(suit)
    })()

    // for (const value of [1, 2, 3, 4, 5, 8]) {
    // transparent base image
    const base = mkImage()

    if (opts.baseUrl) {
        const image = await mkDomImage(opts.baseUrl)
        base.layer.add(new I.Image({ image /*x: 0, y: 0, width: W, height: H*/ }))
    }
    // white mask
    const mask = mkImage()
    mask.layer.add(new I.Rect({ x: 0, y: 0, width: W, height: H, fill: 'transparent' }))

    const positions: CardSuitPosition[] = getCardLayout(value)

    const normalize = (p: CardSuitPosition, growBy = 1): NodeConfig => {
        const width = growBy * (p.size != null ? p.size * base.stage.width() : iconSize)
        return {
            x: p.x * base.stage.width(),
            y: p.y * base.stage.height(),
            width: width,
            height: width,
            scaleY: p.flip ? -1 : 1,
            offsetX: width / 2,
            offsetY: width / 2,
        }
    }

    const iconSize = base.stage.width() / 4
    for (const pos of positions) {
        // base image
        const norm = normalize(pos)
        const nthSymbol = new I.Image({ image, ...norm })

        // base halo
        const norm2 = normalize(pos, 1.4)
        const nthHalo = new I.Image({ image, ...norm2, opacity: 0.5 })
        base.layer.add(nthHalo, nthSymbol)

        // mask image
        const norm3 = normalize(pos, 0.8)
        const maskImg = new I.Image({ image, ...norm })
        // maskImg.cache()
        // maskImg.filters([I.Konva.Filters.Brighten])
        // maskImg.brightness(-0.3)
        // maskImg.opacity(0.6)
        mask.layer.add(maskImg)
    }

    // add numbers and suit color on top-left and bottom-right corners
    const textOptions: TextConfig = {
        fontFamily: 'Times New Roman',
        fontSize: W / 10,
        fontWeight: 'bold',
        align: 'center',
        verticalAlign: 'middle',
        fill: 'white',
    }
    const topNumber    = new I.Text({ text: opts.value, x: .1*W, y: .1*W , ...textOptions }) // prettier-ignore
    const bottomNumber = new I.Text({ text: opts.value, x: .9*W, y: H-.1*W, ...textOptions, scaleY: -1 }) // prettier-ignore
    const topSuit      = new I.Image({ image,           x: 20,   y: 60 , width: 30, height: 30 }) // prettier-ignore
    const bottomSuit   = new I.Image({ image,           x: 20,   y: 360, width: 30, height: 30, scaleY: -1 }) // prettier-ignore
    base.layer.add(topNumber, bottomNumber, topSuit, bottomSuit)

    // export the base
    base.stage.draw()
    const dataURL_base = base.stage.toDataURL({ width: W, height: H })

    // export the mask
    base.stage.draw()
    const dataURL_mask = mask.stage.toDataURL({ width: W, height: H })
    return {
        base: await flow.load_dataURL(dataURL_base),
        mask: await flow.load_dataURL(dataURL_mask),
    }
}
