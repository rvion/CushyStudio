import { PanelOutputConf } from './PanelOutput_conf'

export const LatentIfLastUI = obs(function LatentIfLastUI_(p: {}) {
   const lastImage = cushy.db.media_image.last()
   const latent = cushy.latentPreview
   const sizeStr = PanelOutputConf.zValue.latentSize + '%'
   if (latent == null) return null // <>🔴 NO LATENT 🔴</>
   if (lastImage == null || latent.receivedAt > lastImage.createdAt) {
      return (
         <img //
            tw='absolute bottom-0 right-0 z-50 select-none shadow-xl'
            style={{
               //
               filter: cushy.project.filterNSFW ? 'blur(50px)' : undefined,
               width: sizeStr,
               height: sizeStr,
               objectFit: 'contain',
               opacity: PanelOutputConf.zValue.latentTransparency / 100,
            }}
            src={latent.url}
            alt='last generated image'
         />
      )
   }
   return null
   // return (
   //     <div tw='absolute bottom-0 right-0 shadow-xl z-50 !bg-red-700'>
   //         <div>{sizeStr}</div>
   //         <div>{sizeStr}</div>
   //     </div>
   // )
})
