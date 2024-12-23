import type { Field_size } from './FieldSize'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'

export const AspectRatioSquareUI = observer(function AspectRatioSquareUI_(p: { sizeHelper: Field_size }) {
   const uist = p.sizeHelper
   const csuite = useCSuite()
   const ratioDisplaySize =
      csuite.inputHeight * 2.05 * parseFloat(getComputedStyle(document.documentElement).fontSize)
   const theme = cushy.theme.value

   return (
      <Frame // Aspect ratio display background
         border={csuite.inputBorder}
         roundness={csuite.inputRoundness}
         base={csuite.inputContrast}
         dropShadow={theme.inputShadow}
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
                    uist.width < uist.height
                       ? Math.round((uist.width / uist.height) * ratioDisplaySize) / ratioDisplaySize
                       : '1'
                 })
                 scaleY(${
                    uist.height < uist.width
                       ? Math.round((uist.height / uist.width) * ratioDisplaySize) / ratioDisplaySize
                       : '1'
                 })`,
            }}
         />
      </Frame>
   )
})
