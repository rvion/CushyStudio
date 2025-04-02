import type { Mask$ } from '../stateV2/Masks$'

import { ShellInputOnly } from '../../../csuite-cushy/shells/ShellInputOnly'
import { Button } from '../../../csuite/button/Button'
import { Frame } from '../../../csuite/frame/Frame'

export const UCMaskMenuUI = obs(function UCMaskMenuUI_(p: {
   //
   mask: Mask$['z$Field']
   index: number
}) {
   const inputHeight = cushy.preferences.interface.zValue.inputHeight
   const isVisible: boolean = p.mask.visible.zValue
   const imgField = p.mask.image
   const image = imgField?.zValue_or_zero

   // TEMP
   // Do not use interface.value.inputHeight in the future. Have a separate option for layer size?
   const SIZE = 2 // was:3
   const frameSize_ = `${inputHeight * SIZE + 0.5}rem`
   const imageSize_ = `${inputHeight * SIZE}rem`

   const ui = (
      <Frame
         tw={['flex gap-2', 'p-1', 'rounded-md']}
         base={{ contrast: 0.1, chroma: 0.077 }}
         style={{ height: frameSize_ }}
         hover
      >
         <Frame
            base={{ contrast: -0.1 }}
            border={{ contrast: 0.4 }}
            tw='overflow-clip rounded-md'
            style={{ width: imageSize_, minWidth: imageSize_, maxWidth: imageSize_ }}
            // filter: 'drop-shadow(0px 1px 0px black)',
         >
            <img src={image?.url} />
            {/*
                // TODO add back
                <CachedResizedImage
                    draggable={false}
                    onDragStart={() => false}
                    onDrop={() => false}
                    src={image?.url}
                    size={128}
                /> */}
         </Frame>
         {/*  */}
         <div tw='flex w-full flex-col'>
            <div tw={['flex flex-grow gap-2']} style={{ height: `${inputHeight}rem` }}>
               <p.mask.name.UI Shell={ShellInputOnly} />
            </div>
            {/* <div tw={['flex flex-grow gap-2']} style={{ height: `${inputHeight}rem` }}></div> */}
            <div tw={['flex flex-grow']} style={{ height: `${inputHeight}rem` }}>
               <Button //
                  // base={{ hue: 250, chroma: 0.1, contrast: 0.5 }}
                  onClick={() => p.mask.visible.toggle()}
                  icon={IKONS.mdiBrush}
               />

               {/* <SpacerUI /> */}
               <Button
                  onClick={() => p.mask.zDisableSelfWithinParent()}
                  icon={IKONS.mdiDelete}
                  borderless
                  subtle
               />
               <Button
                  onClick={() => p.mask.visible.toggle()}
                  icon={isVisible ? IKONS.mdiEye : IKONS.mdiEyeClosed}
                  borderless
                  subtle
               />
            </div>
         </div>
      </Frame>
   )
   return ui
})
