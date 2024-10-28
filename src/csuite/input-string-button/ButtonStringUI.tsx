import type { ButtonProps } from '../button/Button'
import type { InputStringProps } from '../input-string/InputStringUI'
import type { ForwardedRef } from 'react'

import { observer } from 'mobx-react-lite'
import { forwardRef } from 'react'

import { Button } from '../button/Button'
import { InputStringUI } from '../input-string/InputStringUI'
import { RevealUI } from '../reveal/RevealUI'

export type ButtonStringProps = {
   setValue: InputStringProps['setValue']
   getValue: InputStringProps['getValue']
} & ButtonProps

export const ButtonStringUI = observer(
   forwardRef(function WidgetStringUI_(
      { getValue, setValue, ...rest }: ButtonStringProps,
      ref: ForwardedRef<HTMLDivElement>,
   ) {
      return (
         <RevealUI
            trigger={'rightClick'}
            placement={'above'}
            content={() => (
               <InputStringUI //
                  autoFocus
                  setValue={setValue}
                  getValue={getValue}
               />
            )}
         >
            <Button //
               ref={ref}
               {...rest}
            ></Button>
         </RevealUI>
      )
   }),
)

/* 
Type '(ev: FocusEvent<HTMLInputElement, Element>) => void' is not assignable 
type '(ev: FocusEvent<HTMLDivElement, Element>) => void'.

*/
