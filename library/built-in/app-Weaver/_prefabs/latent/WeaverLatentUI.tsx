import type { $WeaverLatent } from './prefab_weaver_latent'

import { StackCardUI, type StackData } from '../prefab_Stack'

export const StackLatentUI = obs(function WeaverLatentUI_(p: {
   field: $WeaverLatent['{field}']
   dataField: StackData['{field}']
   stackField: Z.List<StackData>['{field}']
   stackIndex: number
}) {
   const field = p.field
   const f = field.zValue
   const theme = cushy.preferences.theme.zValue
   const aspectRatio = f.image.height / f.image.width
   const horizontal = f.image.width > f.image.height
   return (
      <StackCardUI //
         field={p.dataField}
         stackField={p.stackField}
         stackIndex={p.stackIndex}
         icon={p.field.zIcon}
      >
         <div tw='py-1'>
            <uy.layout.Row align>
               {Object.keys(field.mode.zConfig.items).map((key: string) => {
                  return (
                     <uy.inputs.BoolUI
                        toggleGroup={field.zUid + '_LATENTGROUP'}
                        display={'button'}
                        expand
                        value={field.mode.isBranchEnabled(key as any)}
                        onValueChange={() => field.mode.toggleBranch(key as any)}
                     >
                        {key}
                     </uy.inputs.BoolUI>
                  )
               })}
            </uy.layout.Row>
            {/* <uy.prop obj={field.} /> */}
            <div tw='py-1'>
               <uy.layout.Col tw='gap-1'>
                  <uy.number.def field={field.batchSize} />
                  {/* <field.BatchSize.UI /> */}
                  {field.mode.zValue.empty && (
                     <uy.layout.Col align>
                        <uy.number.def field={field.dimensions.width} />
                        <uy.number.def field={field.dimensions.height} />
                     </uy.layout.Col>
                  )}
                  {field.mode.zValue.image && (
                     <uy.layout.Row tw='gap-1'>
                        <uy.layout.Col align>
                           <uy.number.def field={field.location.x} />
                           <uy.number.def field={field.location.y} />
                        </uy.layout.Col>
                        <uy.layout.Col align>
                           <uy.number.def field={field.scale.x} />
                           <uy.number.def field={field.scale.y} />
                        </uy.layout.Col>
                     </uy.layout.Row>
                  )}
                  {field.mode.zValue.random && (
                     <uy.layout.Col align>
                        <uy.number.def field={field.dimensions.width} />
                        <uy.number.def field={field.dimensions.height} />
                     </uy.layout.Col>
                  )}
               </uy.layout.Col>
            </div>
            <uy.misc.ResizableFrame startHeight={512}>
               <_EmptyUI field={field} />
            </uy.misc.ResizableFrame>
         </div>
      </StackCardUI>
   )
})
const _EmptyUI = obs(function _EmptyUI_(p: { field: $WeaverLatent['{field}'] }) {
   // const theme = cushy.preferences.theme.zValue
   const f = p.field.zValue
   const imageL = p.field.image.zValue

   const [isOver, dropRef] = uy.dnd.useDropZone({
      config: { shallow: true },
      Image: {
         onDrop: (item, monitor) => {
            f.image = item
         },
         onHover: (item, monitor) => {
            cushy.dndHandler.setContent({
               icon: IKONS.mdiImage,
               label: 'Drop Image',
               suffixIcon: IKONS.mdiMenuOpen,
            })
         },
      },
   })

   const horizontal = imageL.width > imageL.height
   const correctX = horizontal ? f.scale.x : f.scale.x * (imageL.width / imageL.height)
   const correctY = horizontal ? f.scale.y * (imageL.height / imageL.width) : f.scale.y
   const imageScaleX = 2 - correctX
   const imageScaleY = 2 - correctY

   // multiply by aspect ratio
   return (
      <div //Contain the Overlay so it doesn't seep in to resizable frame's footer
         ref={dropRef}
         tw={['relative flex h-full w-full overflow-hidden', isOver && 'opacity-75']}
      >
         {f.mode.image && (
            <div tw='flex h-full w-full items-center justify-center'>
               <div
                  tw='!aspect-square'
                  style={{
                     // width: `${100 * scale.x}%`,
                     // height: `${scale.y > 1 ? 100 * scale.y : 100}%`,
                     // height: `${scale.y > 1 ? scale.y * 100 : 100}%`,
                     height: `100%`,
                     maxWidth: '100%',
                     maxHeight: '100%',
                     // transform: `
                     // scaleX(${scale.x})
                     // scaleY(${scale.y})`,
                  }}
               >
                  <div // Fixes vertical position while maintaining aspect ratio
                     tw='flex h-full w-full items-center justify-center'
                  >
                     <uy.misc.Frame
                        base={{ contrast: -0.1 }}
                        tw='!aspect-square w-full self-center overflow-hidden '
                        roundness={3}
                        style={{
                           width: `100%`,
                           // paddingRight: `${scale.x * 100 - 100}%`,
                           // paddingLeft: `${scale.x * 100 - 100}%`,
                           // height: `${scale.y > 1 ? 100 * scale.y : 100}%`,
                           // height: `${scale.y >= 1 ? 100 * scale.y : 100 * scale.x}%`,
                           maxWidth: '100%',
                           maxHeight: '100%',
                        }}
                     >
                        <img
                           //
                           src={p.field.image.zValue.url}
                           tw='h-full w-full object-contain '
                           style={{
                              transform: `
                              translateX(${-(f.location.x / imageL.width) * 100}%)
                              translateY(${-(f.location.y / imageL.height) * 100}%)
                              scaleX(
                               ${correctX > 1 ? (imageScaleX > 0.01 ? imageScaleX : 0.01) : '100%'}
                              )
                              scaleY(
                                 ${correctY > 1 ? Math.max(0.01, Math.min(imageScaleY, 1)) : '100%'}
                              )
                              `,
                           }}
                        />
                     </uy.misc.Frame>
                  </div>
               </div>
            </div>
         )}
         <_SizeIndicatorUI field={p.field} />
      </div>
   )
})

// Could probably be re-used if de-coupled from the field, fuck this thing
const _SizeIndicatorUI = obs(function _SizeIndicatorUI_(p: { field: $WeaverLatent['{field}'] }) {
   const theme = cushy.preferences.theme.zValue
   const f = p.field.zValue
   const imageL = p.field.image.zValue

   const horizontal = f.mode.image ? imageL.width > imageL.height : f.dimensions.width > f.dimensions.height

   const scale = f.mode.image
      ? {
           x: horizontal ? f.scale.x : f.scale.x * (imageL.width / imageL.height),
           y: horizontal ? f.scale.y * (imageL.height / imageL.width) : f.scale.y,
        }
      : {
           x: horizontal ? 1 : f.dimensions.width / f.dimensions.height,
           y: horizontal ? f.dimensions.height / f.dimensions.width : 1,
        }

   const shadowColor = theme.global.shadow?.color ?? 'black'

   return (
      <div tw='absolute flex h-full w-full items-center justify-center'>
         <div
            tw='flex !aspect-square items-center justify-center'
            style={{
               height: '100%',
               maxWidth: '100%',
               maxHeight: '100%',
            }}
         >
            <div
               // tw='!aspect-square'
               style={{
                  width: '100%',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  // Use transform here because it works with floats and will not cause popping/mis-alignments.
               }}
            >
               <uy.misc.Frame
                  base={{ contrast: -0.1 }}
                  tw={[
                     'flex aspect-square h-full w-full items-center justify-center',
                     f.mode.image && '!bg-transparent',
                  ]}
               >
                  <uy.misc.Frame
                     tw={['!aspect-square', f.mode.image && '!bg-transparent']}
                     border={{ contrast: 0.2, chromaBlend: 5 }}
                     base={
                        f.mode.image
                           ? {
                                contrast: 0.5,
                                chromaBlend: 1.5,
                                hue: 145,
                             }
                           : {
                                contrast:
                                   theme.global.active.l?.contrast != null
                                      ? theme.global.active.l?.contrast + 0.1
                                      : undefined,
                                // contrast: 100,
                                chroma: theme.global.active.c?.chroma,
                                chromaBlend: theme.global.active.c?.chromaBlend,
                                hue: theme.global.active.h?.hue,
                                hueShift: theme.global.active.h?.hueShift,
                             }
                     }
                     roundness={3}
                     style={{
                        width: `${Math.max(scale.x * 100, 0)}%`,
                        height: `${Math.max(scale.y * 100, 0)}%`,
                        maxWidth: `100%`,
                        maxHeight: `100%`,
                        borderStyle: f.mode.image ? 'dashed' : 'solid',
                        borderWidth: '1px',
                        // Creates an outline around the border
                        filter: f.mode.image
                           ? `drop-shadow(1px 0px ${shadowColor}) drop-shadow(-1px 0px ${shadowColor}) drop-shadow(0px 1px ${shadowColor}) drop-shadow(0px -1px ${shadowColor})`
                           : undefined,
                     }}
                  />
               </uy.misc.Frame>
            </div>
         </div>
      </div>
   )
})
