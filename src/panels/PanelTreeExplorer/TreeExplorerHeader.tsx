import { Button } from '../../csuite/button/Button'
import { IndexAllAppsBtnUI } from '../PanelWelcome/LibraryHeaderUI'

export const LibraryHeaderUI = obs(function LibraryHeaderUI_(p: {}) {
   return (
      <div tw='flex w-full gap-0.5'>
         <Button icon={IKONS.mdiMagnify} onClick={() => cushy.toggleFullLibrary()}>
            Browse
         </Button>
         <IndexAllAppsBtnUI />
      </div>
   )
})
