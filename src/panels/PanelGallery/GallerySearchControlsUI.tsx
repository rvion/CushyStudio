import { type GalleryConf, useGalleryConf } from './galleryConf'

export const GallerySearchControlsUI = obs(function GallerySearchControlsUI_(p: {}) {
   const conf: GalleryConf = useGalleryConf()
   return (
      <div tw='flex items-center gap-1'>
         <conf.filterTag.UI Shell={uy.shell.FluidUI} />
      </div>
   )
})
