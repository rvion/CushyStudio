import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { toastInfo } from '../../csuite/utils/toasts'

export const PlaygroundElectronUI = observer(function PlaygroundElectronUI_(p: {}) {
   return (
      <div>
         <Button
            onClick={async () => {
               //# TEST 1
               const test1 = await cushy.electron.dialog.showOpenDialog({
                  properties: ['openDirectory'],
               })
               toastInfo(`answer1: ${JSON.stringify(test1)}`)

               //# TEST 1
               const test2 = await cushy.electron.simpleOpenFolder()
               toastInfo(`answer2: ${JSON.stringify(test2)}`)

               //# TEST 3
               const test3 = await cushy.electron.net.online()
               toastInfo(`answer3: ${JSON.stringify(test3)}`)
            }}
         >
            run a few electron stuff
         </Button>
      </div>
   )
})
