import type { DeleteInstructionsFor } from '../../db/TYPES_json'
import type { MediaImageL } from '../../models/MediaImage'

import { cushyFactory } from '../../controls/Builder'
import { command, type Command } from '../../csuite/commands/Command'
import { lazy_viaProxy } from '../../csuite/lazy/lazy_viaProxy'
import { defineMenuTemplate, type MenuTemplate } from '../../csuite/menu/MenuTemplate'
import { Trigger } from '../../csuite/trigger/Trigger'
import { ctx_image } from '../contexts/ctx_image'

export type AvailableImageCopyFormats = 'PNG' | 'JPG' | 'WEBP'

type CopyImageParams = {
   image: MediaImageL
   format?: AvailableImageCopyFormats
}

// first we define command;
// command can take props
export const cmd_copyImage: Command<MediaImageL> = command({
   id: 'copyImage',
   label: 'Copy Image',
   ctx: ctx_image,
   combos: 'mod+c',
   action: (image) =>
      /* { format: image.format, quality: form_foo.fields.quality.value } */
      image.copyToClipboard_viaCanvas(),
})

// first we define command;
// command can take props
export const cmd_deleteImage: Command<MediaImageL> = command({
   id: 'deleteImage',
   label: 'Delete Image',
   ctx: ctx_image,
   combos: 'alt+backspace',
   action: (image) => {
      image.delete({ a: 'cascade' })
      return Trigger.Success
   },
})

export const cmd_copyImage_as = (format: string): Command<MediaImageL> =>
   command({
      id: 'copyImage',
      label: 'Copy Image',
      ctx: ctx_image,
      combos: 'mod+c',
      action: (image) =>
         image.copyToClipboard_viaCanvas({
            format: format,
            quality: form_foo.fields.quality.value,
         }),
   })

export const cmd_copyImage_as_PNG = cmd_copyImage_as('PNG')
export const cmd_copyImage_as_WEBP = cmd_copyImage_as('WEBP')
export const cmd_copyImage_as_JPG = cmd_copyImage_as('JPG')

export const cmd_open_copyImageAs_menu: Command<MediaImageL> = command({
   id: 'gallery.copyImageAs',
   label: 'Copy Image as...',
   combos: 'mod+shift+c',
   ctx: ctx_image,
   action: (image: MediaImageL) => menu_copyImageAs.open({ image }),
})

const form_foo = lazy_viaProxy(() =>
   cushyFactory.document((b) =>
      b.fields({
         quality: b.float({
            min: 0,
            softMin: 0.3,
            max: 1,
            step: 0.01,
            justifyLabel: false,
            label: 'test',
         }),
      }),
   ),
)

export const menu_imageActions: MenuTemplate<{ image: MediaImageL }> = defineMenuTemplate({
   title: 'image actions',
   entries: (p: { image: MediaImageL }) => [
      //
      cmd_copyImage.bind(p.image),
      menu_copyImageAs.bind(p),
   ],
})

export const menu_copyImageAs: MenuTemplate<{ image: MediaImageL }> = defineMenuTemplate({
   title: 'Save image as',
   entries: (p: { image: MediaImageL }) => [
      cmd_copyImage_as_PNG.bind(p.image),
      cmd_copyImage_as_WEBP.bind(p.image),
      cmd_copyImage_as_JPG.bind(p.image),
      form_foo.fields.quality,
   ],
})
