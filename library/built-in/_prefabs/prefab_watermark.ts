import type { MediaImageL, WatermarkProps } from '../../../src/models/MediaImage'
import type { OutputFor } from './_prefabs'

export type UI_watermark_v1 = X.XGroup<{
    pos: X.XGroup<{ x: X.XNumber; y: X.XNumber }>
    font: X.XSelectOne_<'Arial' | 'Times New Roman' | 'Courier New'>
    format: X.XSelectOne_<'image/webp' | 'image/png' | 'image/jpeg'>
    content: X.XString
    color: X.XString
    fontSize: X.XNumber
    quality: X.XNumber
    tool: X.XSelectOne_<'canvas' | 'konva'>
}>
export function ui_watermark_v1(): UI_watermark_v1 {
    const ui = getCurrentForm()
    return ui.fields({
        pos: ui.row({ items: { x: ui.int({ default: 100 }), y: ui.int({ default: 100 }) } }),
        font: ui.selectOneV2(['Arial', 'Times New Roman', 'Courier New'], { justifyLabel: false }),
        format: ui.selectOneV2(['image/webp', 'image/png', 'image/jpeg'], { justifyLabel: false }),
        content: ui.textarea({ default: 'Cushy Diffusion' }),
        color: ui.colorV2({ default: 'black' }),
        fontSize: ui.int({ default: 20, min: 3, softMax: 30 }),
        quality: ui.number({ min: 0, max: 1, default: 1 }),
        tool: ui.selectOneV2(['canvas', 'konva']),
    })
}

export async function run_watermark_v1(
    //
    ui: OutputFor<typeof ui_watermark_v1>,
    img?: Maybe<MediaImageL>,
): Promise<Maybe<MediaImageL>> {
    const run = getCurrentRun()
    const image = img ?? run.lastImage ?? cushy.db.media_image.last()
    if (!image) return
    const params: WatermarkProps = {
        x: ui.pos.x,
        y: ui.pos.y,
        fontSize: ui.fontSize,
        color: ui.color,
        font: ui.font.id,
        format: ui.format.id,
        quality: ui.quality,
    }
    if (ui.tool.id === 'canvas') {
        return image.addWatermark_withCanvas(ui.content, params)
    } else {
        return image.addWatermark_withKonva(ui.content, params)
    }
}

/** add a watermark to every image generated in this step */
export const run_addFancyWatermarkToAllImage = (): Promise<MediaImageL[]> => {
    const run = getCurrentRun()
    const out: Promise<MediaImageL>[] = []
    for (const img of run.generatedImages)
        out.push(
            img.processImage((ctx: CanvasRenderingContext2D) => {
                // params
                const ratio = img.width / 1000
                const X = img.width - 250 * ratio
                ctx.fillStyle = 'white'
                ctx.strokeStyle = 'black'

                // draw big text saying AI
                ctx.font = `bold ${200 * ratio}px Arial`
                ctx.fillText('AI', X, img.height - 90 * ratio)
                ctx.strokeText('AI', X, img.height - 90 * ratio)

                // draw small text saying CushyStudio
                ctx.font = `${40 * ratio}px Arial`
                ctx.fillText('CushyStudio', X, img.height - 40 * ratio)
            }),
        )
    return Promise.all(out)
}
