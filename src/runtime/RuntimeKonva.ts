import type { Runtime } from './Runtime'
import type { ImageConfig } from 'konva/lib/shapes/Image'

import konva from 'konva'
import { makeAutoObservable } from 'mobx'
import { isAbsolute, resolve } from 'pathe'

import { createHTMLImage_fromURL } from '../state/createHTMLImage_fromURL'
import { MediaImageL } from 'src/models/MediaImage'

/**
 * provide both raw-access to the underling KonvaJS library
 * and higher level accesses to simplify cushy<->konva interactions
 */
export class RuntimeKonva {
    /** access to the full Konva library */
    Konva: typeof konva = konva

    Image = (imageConfig: ImageConfig): konva.Image => new this.Konva.Image(imageConfig)

    Image_fromPath = async (absPath: string, opts?: Omit<ImageConfig, 'image'>): Promise<konva.Image> => {
        const img = await this.createHTMLImage_fromPath(absPath)
        return new this.Konva.Image({ image: img, ...opts })
    }

    convertLayerToDataURL = (layer: konva.Layer): string => {
        layer.draw()
        const b64 = layer.toDataURL()
        return b64
    }
    createImageFromLayer = async (layer: konva.Layer): Promise<MediaImageL> => {
        layer.add(await this.rt.Konva.Image_fromPath('site/static/img/CushyLogo.png'))
        layer.draw()
        const b64 = layer.toDataURL()
        const img = this.rt.Images.createFromDataURL(b64)
        return img
    }

    constructor(private rt: Runtime) {
        makeAutoObservable(this, { Konva: false })
    }

    /** konva work by  */
    createStageWithLayer = (p: { width: number; height: number }): konva.Layer => {
        const container: HTMLDivElement = this.createDivContainer()
        const stage = new this.Konva.Stage({ container: container, width: p.width, height: p.height })
        const layer = new this.Konva.Layer()
        stage.add(layer)
        return layer
    }

    /** 🔶 you'll have to create at least one layouer yourself */
    createStageWithoutLayer = (p: { width: number; height: number }) => {
        const container: HTMLDivElement = this.createDivContainer()
        const stage = new this.Konva.Stage({ container: container, width: p.width, height: p.height })
        return stage
    }

    // -----------------------------------------
    addGradientToLayer = (layer: konva.Layer, color: Array<number | string>) => {
        layer.add(
            new this.Konva.Rect({
                x: 0,
                y: 0,
                width: layer.width(),
                height: layer.height(),
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: layer.width(), y: layer.height() },
                fillLinearGradientColorStops: color,
                listening: false,
            }),
        )
    }

    // -----------------------------------------
    // Konva stages need an HTML elevent to exists
    createDivContainerDebug = (): HTMLDivElement => {
        const container = this.createDivContainer()
        container.style.width = '300px'
        container.id = 'konvaPreview'
        container.style.height = '450px'
        // container.style.backgroundColor = 'red'
        container.style.zIndex = '99999999'
        container.style.border = '1px solid red'

        // make absolute
        container.style.position = 'absolute'
        container.style.top = '10px'
        container.style.left = '10px'
        // mount to body
        document.body.appendChild(container)
        return container
    }

    createDivContainer = (): HTMLDivElement => {
        const container: HTMLDivElement =
            (document.getElementById('konvaPreview') as Maybe<HTMLDivElement>) ?? //
            document.createElement('div')
        return container
    }

    // -----------------------------------------
    createHTMLImage_fromPath(
        /** the same `src` value you would use in an <img /> html node */
        path: string,
    ): Promise<HTMLImageElement> {
        return new Promise((yes, no) => {
            const abspath = isAbsolute(path) //
                ? path
                : resolve(this.rt.Cushy.rootPath, path)
            const img = new Image()
            img.onload = () => yes(img)
            img.onerror = no
            img.src = 'file://' + abspath
        })
    }

    createHTMLImage_fromURL = createHTMLImage_fromURL

    /**
     * @deprecated
     * use `getHTMLImage_fromURL` instead
     * */
    loadImage = this.createHTMLImage_fromURL
}
