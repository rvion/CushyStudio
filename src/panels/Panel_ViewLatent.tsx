import { observer } from 'mobx-react-lite'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

export const Panel_ViewLatent = observer(function Panel_ViewLatent_(p: {}) {
   const url = cushy.latentPreview?.url
   // 🛝 const background = st.galleryConf.value.galleryBgColor ?? undefined
   return (
      <div tw='flex h-full w-full flex-col' /* 🛝 style={{ background }} */>
         <TransformWrapper centerZoomedOut centerOnInit>
            <TransformComponent
               wrapperStyle={{ height: '100%', width: '100%' }}
               contentStyle={{ height: '100%', width: '100%' }}
            >
               {url ? (
                  <img //
                     style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                     src={url}
                     alt='last generated image'
                  />
               ) : (
                  <div tw='flex h-96 w-96 items-center justify-center'>
                     <div>no image yet</div>
                  </div>
               )}
               {/* </div> */}
            </TransformComponent>
         </TransformWrapper>
      </div>
   )
})
