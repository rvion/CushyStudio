import type { Field_size } from './FieldSize'

import { Frame } from '../../frame/Frame'

export const AspectRatioSquareUI = obs(function AspectRatioSquareUI_(p: { sizeHelper: Field_size }) {
   const uist = p.sizeHelper
   const ratioDisplaySize =
      cushy.preferences.interface.zValue.inputHeight *
      2.05 *
      parseFloat(getComputedStyle(document.documentElement).fontSize)
   const theme = cushy.preferences.theme.zValue

   const width = uist.width_or_zero || 1
   const height = uist.height_or_zero || 1
   return (
      <Frame // Aspect ratio display background
         border={theme.global.border}
         roundness={theme.global.roundness}
         base={theme.global.contrast}
         dropShadow={theme.global.shadow}
         hover
         square
         tw={[
            //
            'overflow-clip',
            'items-center justify-center',
            'cursor-pointer',
            // `aspect-square w-[100%]`,
         ]}
         onClick={() => uist.flip()}
         tooltip='Flip aspect ratio'
         style={{
            //
            width: ratioDisplaySize,
            height: ratioDisplaySize,
         }}
      >
         <Frame
            base={10}
            tw='!relative h-full w-full'
            style={{
               //
               width: '100%',
               height: '100%',
               borderRadius: '0px',
               // Use transform here because it works with floats and will not cause popping/mis-alignments.
               transform: `
                 scaleX(${
                    width < height ? Math.round((width / height) * ratioDisplaySize) / ratioDisplaySize : '1'
                 })
                 scaleY(${
                    height < width ? Math.round((height / width) * ratioDisplaySize) / ratioDisplaySize : '1'
                 })`,
            }}
         />
      </Frame>
   )
})
