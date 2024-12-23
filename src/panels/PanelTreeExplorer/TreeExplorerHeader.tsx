import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { IndexAllAppsBtnUI } from '../PanelWelcome/LibraryHeaderUI'

export const LibraryHeaderUI = observer(function LibraryHeaderUI_(p: {}) {
   return (
      <div tw='flex w-full gap-0.5'>
         <Button icon='mdiMagnify' onClick={() => cushy.toggleFullLibrary()}>
            Browse
         </Button>
         <IndexAllAppsBtnUI />
      </div>
   )
})
