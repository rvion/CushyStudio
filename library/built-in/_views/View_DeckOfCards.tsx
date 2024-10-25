import { useState } from 'react'

import { useSizeOf } from '../../../src/csuite/smooth-size/useSizeOf'

export const View_DeckOfCards = view<{
   images: MediaImageID[]
}>({
   preview: () => <div>🃏</div>,
   render: (p) => {
      const [hovered, setHovered] = useState(-1)
      const { ref, size } = useSizeOf()
      const count = p.images.length
      // const margin = 100 /* px */
      const width = size.width ?? 100
      const height = size.height ?? 100
      const cardWidth = Math.min(width / 3)
      const cardHeight = cardWidth * 1.5
      const idealDist = cardWidth * 0.4
      const validWidth = width - cardWidth
      const shift =
         count * idealDist < validWidth //
            ? idealDist
            : (idealDist * validWidth) / (count * idealDist)

      const cardPositions: { dx: number; dy: number; angle: number }[] =
         count % 2 === 0
            ? [
                 ...new Array(count / 2).fill(0).map((_, i) => ({
                    angle: (i / count) * 40,
                    dx: shift * (i + 0.5),
                    dy: (i / count) * cardWidth,
                 })),
                 ...new Array(count / 2).fill(0).map((_, i) => ({
                    angle: -(i / count) * 40,
                    dx: -shift * (i + 0.5),
                    dy: (i / count) * cardWidth,
                 })),
              ]
            : [
                 { dx: 0, dy: 0, angle: 0 },
                 ...new Array((count - 1) / 2).fill(0).map((_, i) => ({
                    angle: ((i + 1) / count) * 40,
                    dx: shift * (i + 1),
                    dy: (i / count) * cardWidth,
                 })),
                 ...new Array((count - 1) / 2).fill(0).map((_, i) => ({
                    angle: -((i + 1) / count) * 40,
                    dx: -shift * (i + 1),
                    dy: (i / count) * cardWidth,
                 })),
              ]
      return (
         <div
            //
            style={{
               //
               // grayish gradient
               background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #3d3d3d 100%)',
            }}
            tw='w-full flex-1 w-full h-full bd1 overflow-hidden'
            ref={ref}
         >
            {/* {JSON.stringify(size)} */}
            {p.images.map((imageID, ix) => {
               // const angle = minAngle + (maxAngle - minAngle) * ((ix + 1) / p.images.length)
               const x = width / 2 + cardPositions[ix]?.dx!
               const y = height * 0.8 + cardPositions[ix]?.dy!
               const angle = cardPositions[ix]?.angle!
               return (
                  <>
                     <img //
                        onMouseEnter={() => setHovered(ix)}
                        onMouseLeave={() => {
                           if (hovered == ix) setHovered(-1)
                        }}
                        tw='animate-in zoom-in-75 transition-all '
                        style={{
                           position: 'absolute',
                           zIndex: hovered === ix ? 10000 : Math.round(x),
                           opacity: '0',
                           width: cardWidth,
                           top: `${y}px`,
                           left: `${x}px`,
                           transformOrigin: 'center',
                           transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        }}
                        key={imageID}
                        src={cushy.db.media_image.get(imageID)?.url}
                     />
                     <img //
                        tw='animate-in zoom-in-75 transition-all pointer-events-none'
                        style={{
                           position: 'absolute',
                           zIndex: hovered === ix ? 10000 : Math.round(x),
                           width: cardWidth,
                           filter: 'drop-shadow(0px 0px 10px rgb(0, 0, 0))',
                           top:
                              hovered === ix //
                                 ? `${y - cardHeight / 2}px`
                                 : `${y}px`,
                           left: `${x}px`,
                           transformOrigin: 'center',
                           transform:
                              hovered === ix
                                 ? `translate(-50%, -50%) scale(1.6)`
                                 : `translate(-50%, -50%) rotate(${angle}deg)`,
                           // -------------
                           transitionProperty: 'all',
                           transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                           transitionDuration: '250ms',
                        }}
                        key={imageID}
                        src={cushy.db.media_image.get(imageID)?.url}
                     />
                  </>
               )
            })}
         </div>
      )
   },
})
