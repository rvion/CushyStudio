import type { DragDropManager } from 'dnd-core'

import { runInAction } from 'mobx'

import { useMemo } from 'react'
import { useDragDropManager } from 'react-dnd'
import { ToastContainer } from 'react-toastify'

import { CushyUI } from '../../app/layout/AppUI'
import { TargetBox } from '../../importers/TargetBox'
import { STATE } from '../../state/state'
import { asAbsolutePath } from '../../utils/fs/pathUtils'

const path = asAbsolutePath(process.cwd())

export const MainUI = obs(function MainUI_() {
   const dragDropManager: DragDropManager = useDragDropManager()
   const st = useMemo(() => runInAction(() => new STATE(path, dragDropManager)), [])
   return (
      <>
         <ToastContainer />
         <TargetBox>
            <CushyUI />
         </TargetBox>
      </>
   )
})
