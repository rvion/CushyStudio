import type { Field_size } from './FieldSize'

import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'
import { InputNumberUI } from '../../input-number/InputNumberUI'
import { AspectLockButtonUI } from './AspectLockButtonUI'
import { AspectRatioSquareUI } from './AspectRatioSquareUI'

export const WidgetSizeX_LineUI = obs(function WidgetSize_LineUI_(p: {
   size: Field_size
   bounds?: { min?: number; max?: number; step?: number }
}) {
   const uist = p.size

   // const ratio = uist.width / uist.height
   // const ratioIcon = ratio == 1.0 ? IKONS.mdiApproximatelyEqual : ratio > 1.0 ? IKONS.mdiCropLandscape : IKONS.mdiCropPortrait

   const theme = cushy.preferences.theme.zValue

   return (
      <div className='full flex flex-1 gap-1'>
         <Frame //Joined container
            border={theme.global.border}
            roundness={theme.global.roundness}
            align
            col
            expand
         >
            <InputNumberUI
               min={p.bounds?.min ?? 128}
               max={p.bounds?.max ?? 4096}
               step={p.bounds?.step ?? 32}
               mode='int'
               value={uist.width_or_zero}
               hideSlider
               onValueChange={(next) => {
                  uist.setWidth(next)
                  uist.zTouch()
               }}
               forceSnap={true}
               text='Width'
               suffix='px'
               onBlur={() => uist.zTouch()}
            />
            <InputNumberUI
               //
               min={p.bounds?.min ?? 128}
               max={p.bounds?.max ?? 4096}
               step={p.bounds?.step ?? 32}
               hideSlider
               mode='int'
               value={uist.height_or_zero}
               onValueChange={(next) => {
                  uist.setHeight(next)
                  uist.zTouch()
               }}
               forceSnap={true}
               text='Height'
               suffix='px'
               onBlur={() => uist.zTouch()}
            />
            {/* <Button onClick={uist.flip} icon={ratioIcon} style={{ border: 'none', borderRadius: '0px' }} /> */}
            {/* <div tw='h-full' style={{ width: '1px' }} /> */}
            {/* <div tw='h-full' style={{ width: '1px' }} /> */}
         </Frame>
         <AspectRatioSquareUI sizeHelper={uist} />
         <AspectLockButtonUI sizeHelper={uist} />
      </div>
   )
})
