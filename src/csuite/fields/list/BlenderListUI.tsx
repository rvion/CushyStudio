import type { BaseSchema } from '../../model/BaseSchema'
import type { Field_list } from './FieldList'
import type { ReactNode } from 'react'

import { runInAction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { Frame } from '../../frame/Frame'
import { InputStringUI } from '../../input-string/InputStringUI'
import { ResizableFrame } from '../../resizableFrame/resizableFrameUI'
import { ListButtonAddUI } from './ListButtonAddUI'

export type BlenderListProps<T extends Field_list<any>> = {
   field: T
   renderItem: (item: T['items'][number]) => ReactNode
}

export const BlenderListUI = observer(function BlenderListUI_<T extends Field_list<BaseSchema>>({
   field,
   renderItem,
}: BlenderListProps<T>) {
   const size = field.size
   const x = useLocalObservable(() => ({ selectedIx: 0 }))
   const selectedChild = field.items[x.selectedIx]
   return (
      <Frame tw='ml-8 flex flex-col gap-2'>
         <Frame row>
            <ResizableFrame
               footer={<BlenderListFooterFilterUI />}
               border
               tw='w-full text-sm'
               currentSize={size}
               onResize={(val) => {
                  field.size = val
               }}
               snap={16}
               base={{ contrast: -0.025 }}
            >
               {field.items.map((i, ix) => {
                  const selected = x.selectedIx === ix
                  return (
                     <Frame //
                        tw='select-none'
                        triggerOnPress={{
                           startingState: selected,
                           toggleGroup: 'blender-list-item-selected',
                        }}
                        onClick={() => (x.selectedIx = ix)}
                        active={selected}
                     >
                        {renderItem(i)}
                     </Frame>
                  )
               })}
            </ResizableFrame>
            <div>
               {/* <ListButtonClearUI field={field} /> */}
               <ListButtonAddUI field={field} />
               <Button icon='mdiChevronDown'></Button>
               <Button
                  disabled={selectedChild == null}
                  icon='mdiMinus'
                  onClick={() =>
                     runInAction(() => {
                        if (x.selectedIx > 0) x.selectedIx--
                        field.removeItemAt(x.selectedIx)
                     })
                  }
               />
            </div>
         </Frame>
         <Frame base={10}>{selectedChild && <selectedChild.UI />}</Frame>
      </Frame>
   )
})

export const BlenderListFooterFilterUI = observer(function BlenderListFooterFilterUI_(p: {}) {
   const x = useLocalObservable(() => ({ filter: '' }))
   return (
      <div>
         <InputStringUI //
            icon='mdiFilter'
            clearable
            getValue={() => x.filter}
            setValue={(next) => (x.filter = next)}
         />
      </div>
   )
})
