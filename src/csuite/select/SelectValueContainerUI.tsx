import { observer } from 'mobx-react-lite'
import { useState } from 'react'

/**
 * this container is used to wrap the list of values in their dense inline form.
 * it is used inline
 */
export const SelectValueContainerUI = observer(function SelectValueContainerUI_<OPTION>(p: {
   //
   wrap?: Maybe<boolean | 'no-wrap-no-overflow-hidden'>
   children?: React.ReactNode
   valuesCount: number
}) {
   const [ref, setRef] = useState<HTMLDivElement | null>(null)
   const [isOverflowing, setIsOverflowing] = useState(false)

   function handleRef(ref: HTMLDivElement | null): void {
      setRef(ref)
      computeOverflow()
   }

   function computeOverflow(): void {
      if (!ref) return
      setIsOverflowing(ref.scrollHeight > ref.clientHeight || ref.scrollWidth > ref.clientWidth)
   }

   return (
      <div
         ref={handleRef}
         tw={[
            'lh-input-2 relative flex w-full flex-grow items-center gap-0.5',
            p.wrap === 'no-wrap-no-overflow-hidden' //
               ? ''
               : p.wrap === true
                 ? 'max-h-28 flex-wrap overflow-hidden'
                 : 'line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap',
         ]}
      >
         {p.children}
         {isOverflowing && <SelectValueOverflowUI valuesCount={p.valuesCount} />}
      </div>
   )
})

export const SelectValueOverflowUI = observer(function SelectValueOverflowUI(p: { valuesCount: number }) {
   if (p.valuesCount <= 1) return null

   return (
      <div tw='box lh-inside h-inside absolute bottom-0 right-0 w-fit whitespace-nowrap rounded bg-gray-100 px-1 leading-normal'>
         {p.valuesCount} valeurs…
      </div>
   )
})
