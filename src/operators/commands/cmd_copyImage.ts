import { CushyFormManager } from '../../controls/FormBuilder'
import { MediaImageL } from '../../models/MediaImage'
import { command, type Command } from '../Command'
import { ctx_image } from '../contexts/ctx_image'
import { menu, type Menu } from '../Menu'

export type AvailableImageCopyFormats = 'PNG' | 'JPG' | 'WEBP'

type CopyImageParams = { image: MediaImageL; format?: AvailableImageCopyFormats }

// first we define command;
// command can take props
export const cmd_copyImage: Command<MediaImageL> = command({
    id: 'copyImage',
    label: 'Copy Image',
    ctx: ctx_image,
    combos: 'mod+c',
    action: (image) =>
        image.copyToClipboard_viaCanvas(/* { format: image.format, quality: form_foo.root.fields.quality.value } */),
})

export const cmd_copyImage_as = (format: string): Command<MediaImageL> =>
    command({
        id: 'copyImage',
        label: 'Copy Image',
        ctx: ctx_image,
        combos: 'mod+c',
        action: (image) => image.copyToClipboard_viaCanvas({ format: format, quality: form_foo.root.fields.quality.value }),
    })

export const cmd_copyImage_as_PNG = cmd_copyImage_as('PNG')
export const cmd_copyImage_as_WEBP = cmd_copyImage_as('WEBP')
export const cmd_copyImage_as_JPG = cmd_copyImage_as('JPG')

export const cmd_open_copyImageAs_menu: Command<MediaImageL> = command({
    id: 'gallery.copyImageAs',
    label: 'Copy Image as...',
    combos: 'mod+shift+c',
    ctx: ctx_image,
    action: (image: MediaImageL) => menu_copyImageAs.open(image),
})

const form_foo = CushyFormManager.form((ui) => ({
    quality: ui.float({ min: 0, softMin: 0.3, max: 1, step: 0.01, alignLabel: false, label: 'test' }),
}))

export const menu_imageActions: Menu<MediaImageL> = menu({
    title: 'image actions',
    entries: (image: MediaImageL) => [
        //
        cmd_copyImage.bind(image),
        menu_copyImageAs.bind(image),
    ],
})

export const menu_copyImageAs: Menu<MediaImageL> = menu({
    title: 'Save image as',
    entries: (image: MediaImageL) => [
        cmd_copyImage_as_PNG.bind(image),
        cmd_copyImage_as_WEBP.bind(image),
        cmd_copyImage_as_JPG.bind(image),
        form_foo.root.fields.quality,
    ],
})
