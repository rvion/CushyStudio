import type { ReactNode } from 'react'
import type { DropTargetMonitor } from 'react-dnd'

import { observer } from 'mobx-react-lite'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import { useSt } from '../state/stateContext'

export const TargetBox = observer((p: { children?: ReactNode }) => {
   const st = useSt()
   const [{ isActive, canDrop, isOver }, drop] = useDrop(
      () => ({
         accept: [
            //
            NativeTypes.FILE,
            // NativeTypes.URL,
            // NativeTypes.TEXT,
         ],
         drop(item: { files: any[] }): void {
            if (item) {
               const files = item.files
               st.droppedFiles.push(...files)
               st.layout.open('Import', {})
            }
         },
         canDrop(item: any): true {
            // console.log('canDrop', item.files, item.items)
            return true
         },
         hover(item: any): void {
            // console.log('hover', item.files, item.items)
         },
         collect: (monitor: DropTargetMonitor): { isOver: boolean; canDrop: boolean; isActive: boolean } => {
            // const item = monitor.getItem() as any
            // if (item) {
            //     console.log('collect', item.files, item.items)
            // }
            const isOver = monitor.isOver()
            const canDrop = monitor.canDrop()

            return {
               isOver,
               canDrop,
               isActive: canDrop && isOver,
            }
         },
      }),
      [p],
   )

   return (
      <div
         //
         tw={[/* isActive ? 'animate-pulse' : null, */ 'h-full w-full']}
         ref={drop}
         // style={style}
      >
         {/* {JSON.stringify(style)} */}
         {p.children ?? (isActive ? 'Release to drop' : 'Import files')}
      </div>
   )
})

// const style: CSSProperties = {
//     border: '1px solid gray',
//     // height: '8rem',
//     // width: '8rem',
//     background: 'linear-gradient(to left, #383422 0%, #371531 100%)',
//     padding: '1rem',
//     textAlign: 'center',
// }
