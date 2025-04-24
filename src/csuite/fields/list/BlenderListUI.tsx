import type { RenderRule } from '../../../csuite-cushy/presenters/RenderRule'
import type { CSchema } from '../../model/CSchema'
import type { Field_list } from './FieldList'
import type { ReactNode } from 'react'

import { action, runInAction } from 'mobx'
import { useLocalObservable } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { Frame } from '../../frame/Frame'
import { InputStringUI } from '../../input-string/InputStringUI'
import { ResizableFrame } from '../../resizableFrame/resizableFrameUI'
import { ListButtonAddUI } from './ListButtonAddUI'

export type BlenderListProps<T extends Field_list<any>> = {
   field: T
   activeIndex?: number
   childRules?: RenderRule<T>[]
   renderItem: (item: T['items'][number], index: number) => ReactNode
   direction?: 'horizontal' | 'vertical'
   // prettier-ignore
   onSelectionChange?: (
      index: number,
      list: T,
      selectedChild: T['{subfields}']['{field}'],
   ) => void
}

export const BlenderListUI = obs(function BlenderListUI_<T extends Field_list<CSchema>>({
   field,
   activeIndex = 0,
   renderItem,
   direction = 'horizontal',
   onSelectionChange,
}: BlenderListProps<T>) {
   const uiConf = useLocalObservable(() => ({ size: undefined as Maybe<number> }), [field])
   const size = uiConf.size
   const x = useLocalObservable(() => ({
      selectedIx: activeIndex,
      select(ix: number): void {
         x.selectedIx = ix
         onSelectionChange?.(ix, field, field.items[x.selectedIx]!)
      },
   }))
   const selectedChild = field.items[x.selectedIx]
   const theme = cushy.preferences.theme.zValue
   const wrapperCls =
      direction === 'horizontal' //
         ? 'flex flex-row gap-2'
         : 'flex flex-col gap-2'
   return (
      <Frame tw={wrapperCls} className='🔘BlenderListUI'>
         <Frame tw='flex flex-row gap-2 px-2' style={{ minHeight: '100%' }}>
            <ResizableFrame
               resizeWidth={direction === 'horizontal'}
               tw='overflow-clip min-w-40'
               footer={<BlenderListFooterFilterUI />}
               currentSize={size}
               onResize={(val) => void (uiConf.size = val)}
               snap={28} // Should be h-input + half of gap-size
               showFooter={false}
            >
               <div tw='flex flex-col gap-0.5 p-1 🔘BlenderListUI_items flex-grow'>
                  {field.items.map((i, ix) => {
                     const selected = x.selectedIx === ix
                     return (
                        <Frame
                           key={i.zUid}
                           tw={['h-widget select-none overflow-clip !border-none !box-content']}
                           triggerOnPress={{ startingState: selected, toggleGroup: 'blender-list-item-selected' }} // prettier-ignore
                           border={{ contrast: 0 }}
                           onClick={action(() => x.select(ix))}
                           base={{ contrast: selected ? 0.1 : 0 }}
                           roundness={theme.global.roundness}
                        >
                           {renderItem(i, ix)}
                        </Frame>
                     )
                  })}
               </div>
            </ResizableFrame>
            <div tw='flex flex-col gap-2'>
               {/* <ListButtonClearUI field={field} /> */}
               <Frame
                  //
                  tw='w-input'
                  align
                  col
                  border={theme.global.border}
                  dropShadow={theme.global.shadow}
                  roundness={theme.global.roundness}
               >
                  <ListButtonAddUI field={field} />
                  <Button
                     disabled={selectedChild == null}
                     icon={IKONS.mdiMinus}
                     onClick={() =>
                        runInAction(() => {
                           field.removeItemAt(x.selectedIx)
                           if (x.selectedIx > field.items.length - 1) x.selectedIx--
                        })
                     }
                  />
               </Frame>
               <Button base={{ contrast: -0.1 }} icon={IKONS.mdiChevronDown}></Button>
               <Frame
                  //
                  tw='w-input'
                  align
                  col
                  disabled={field.items.length < 2}
                  border={theme.global.border}
                  dropShadow={theme.global.shadow}
                  roundness={theme.global.roundness}
               >
                  <Button
                     disabled={selectedChild == null}
                     icon={IKONS.mdiChevronUp}
                     tooltip='Move item up'
                     onClick={() =>
                        runInAction(() => {
                           if (x.selectedIx > 0) field.moveItem(x.selectedIx, --x.selectedIx)
                        })
                     }
                  />
                  <Button
                     disabled={selectedChild == null}
                     icon={IKONS.mdiChevronDown}
                     tooltip='Move item down'
                     onClick={() =>
                        runInAction(() => {
                           if (x.selectedIx < field.items.length - 1)
                              field.moveItem(x.selectedIx, ++x.selectedIx)
                        })
                     }
                  />
               </Frame>
            </div>
         </Frame>
         {selectedChild && <selectedChild.UI classNameForShell='grow' />}
      </Frame>
   )
})

export const BlenderListFooterFilterUI = obs(function BlenderListFooterFilterUI_(p: {}) {
   const x = useLocalObservable(() => ({ filter: '' }))
   return (
      <div tw='flex w-full flex-grow flex-col p-1'>
         <InputStringUI //
            tw='flex-grow'
            icon={IKONS.mdiFilter}
            clearable
            getValue={() => x.filter}
            setValue={(next) => (x.filter = next)}
         />
      </div>
   )
})
