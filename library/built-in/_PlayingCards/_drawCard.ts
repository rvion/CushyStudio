import type { ImageAndMask, Runtime } from '../../../src/runtime/Runtime'
import type { NodeConfig } from 'konva/lib/Node'

import { TextConfig } from 'konva/lib/shapes/Text'

import { exhaust } from '../../../src/csuite/utils/exhaust'
import { CardSuit, CardSuitPosition, CardValue, getCardLayout } from './_cardLayouts'

export async function _drawCard(
   run: Runtime,
   opts: { baseUrl: string; value: CardValue; suit: CardSuit; W: number; H: number },
): Promise<{ base: ImageAndMask; mask: ImageAndMask }> {
   const { suit, value, W, H } = opts
   const canvas = run.Konva
   const K = canvas.Konva

   // BASE IMAGE -----------------------------------------------------------------
   // transparent base image
   const size = { width: W, height: H }
   const base = run.Konva.createStageWithLayer(size)
   if (opts.baseUrl) {
      const image = await canvas.createHTMLImage_fromURL(opts.baseUrl)
      base.add(new K.Image({ image /*x: 0, y: 0, width: W, height: H*/ }))
   }

   // white mask
   const mask = canvas.createStageWithLayer(size)
   mask.add(new K.Rect({ x: 0, y: 0, width: W, height: H, fill: 'transparent' }))

   const positions: CardSuitPosition[] = getCardLayout(value)
   const normalize = (p: CardSuitPosition, growBy = 1): NodeConfig => {
      const width = growBy * (p.size != null ? p.size * base.width() : iconSize)
      return {
         x: p.x * base.width(),
         y: p.y * base.height(),
         width: width,
         height: width,
         scaleY: p.flip ? -1 : 1,
         offsetX: width / 2,
         offsetY: width / 2,
      }
   }

   // LOGOS -----------------------------------------------------------------
   const suitLogoImage = await (() => {
      if (suit === 'diamonds')
         return canvas.createHTMLImage_fromPath('library/built-in/_assets/symbol-diamond.png')
      if (suit === 'clubs') return canvas.createHTMLImage_fromPath('library/built-in/_assets/symbol-club.png')
      if (suit === 'hearts')
         return canvas.createHTMLImage_fromPath('library/built-in/_assets/symbol-heart.png')
      if (suit === 'spades')
         return canvas.createHTMLImage_fromPath('library/built-in/_assets/symbol-spades.png')
      return exhaust(suit)
   })()

   const iconSize = base.width() / 4
   for (const pos of positions) {
      // base image
      const norm = normalize(pos)
      const nthSymbol = new K.Image({ image: suitLogoImage, ...norm })

      // base halo
      const norm2 = normalize(pos, 1.4)
      const nthHalo = new K.Image({ image: suitLogoImage, ...norm2, opacity: 0.5 })
      base.add(nthHalo, nthSymbol)
      base.getStage().add

      // mask image
      const norm3 = normalize(pos, 0.8)
      const maskImg = new K.Image({ image: suitLogoImage, ...norm })
      mask.add(maskImg)

      // maskImg.cache()
      // maskImg.filters([I.Konva.Filters.Brighten])
      // maskImg.brightness(-0.3)
      // maskImg.opacity(0.6)
   }

   // TEXT -----------------------------------------------------------------
   // add numbers and suit color on top-left and bottom-right corners
   const textOptions: TextConfig = {
      fontFamily: 'Times New Roman',
      fontSize: W / 10,
      fontWeight: 'bold',
      align: 'center',
      verticalAlign: 'middle',
      fill: 'white',
   }
   const topNumber    = new K.Text({ text: opts.value, x: .1*W, y: .1*W , ...textOptions }) // prettier-ignore
   const bottomNumber = new K.Text({ text: opts.value, x: .9*W, y: H-.1*W, ...textOptions, scaleY: -1 }) // prettier-ignore
   const topSuit      = new K.Image({ image: suitLogoImage,           x: 20,   y: 60 , width: 30, height: 30 }) // prettier-ignore
   const bottomSuit   = new K.Image({ image: suitLogoImage,           x: 20,   y: 360, width: 30, height: 30, scaleY: -1 }) // prettier-ignore
   base.add(topNumber, bottomNumber, topSuit, bottomSuit)

   // DRAW -----------------------------------------------------------------
   // export the base
   base /*.stage*/
      .draw()
   const dataURL_base = base /*.stage*/
      .toDataURL({ width: W, height: H })

   // export the mask
   base /*.stage*/
      .draw()
   const dataURL_mask = mask /*.stage*/
      .toDataURL({ width: W, height: H })

   return {
      base: await run.Images.createFromDataURL(dataURL_base).loadInWorkflow(run.workflow),
      mask: await run.Images.createFromDataURL(dataURL_mask).loadInWorkflow(run.workflow),
   }
}
