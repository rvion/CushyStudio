import type { Field_string } from './FieldString'

import { action } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'

import { csuiteConfig } from '../../config/configureCsuite'
import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'
import { InputStringUI } from '../../input-string/InputStringUI'

// Textarea HEADER
export const WidgetString_TextareaHeaderUI = observer(function WidgetString_TextareaHeaderUI_(p: {
   field: Field_string
}) {
   const field = p.field
   if (!field.config.textarea) return null
   if (!p.field.serial.collapsed) return null
   return <div tw='line-clamp-1 italic opacity-50'>{JSON.stringify(p.field.value)}</div>
})

// Textarea BODY
export const WidgetString_TextareaBodyUI = observer(function WidgetString_TextareaBodyUI_(p: {
   field: Field_string
   readonly?: boolean
   config?: Field_string['config']
}) {
   const field = p.field
   const csuite = useCSuite()
   const config = p.config ? { ...field.config, ...p.config } : field.config
   const uiSt = useLocalObservable(() => ({
      focused: false,
      value: field.value_or_zero,
   }))

   if (p.readonly) return <pre>{field.value_or_zero}</pre>
   return (
      <Frame base={csuite.inputContrast} expand>
         {/* <pre>{JSON.stringify(Object.keys(p))}</pre> */}
         <textarea
            style={{
               /* ...p.widget.config.style, */
               lineHeight: '1.3rem',
               resize: config.resize ?? 'both',
            }}
            tw='csuite-input w-full !bg-transparent p-2'
            placeholder={config.placeHolder}
            rows={3}
            value={uiSt.focused ? uiSt.value : field.value_or_zero}
            onChange={(ev) => {
               field.value = ev.target.value
               uiSt.value = ev.target.value
            }}
            onBlur={action(() => {
               field.touch()
               uiSt.focused = false
            })}
            onFocus={action(() => {
               uiSt.focused = true
               uiSt.value = field.value_or_zero
            })}
         />
      </Frame>
   )
})

// string HEADER
export const WidgetString_HeaderUI = observer(function WidgetStringUI_(p: {
   field: Field_string
   readonly?: boolean
   config?: Field_string['config']
}) {
   const field = p.field
   const config = p.config ? { ...field.config, ...p.config } : field.config

   // This is necessary to avoid changing the value while the user is typing something
   const uiSt = useLocalObservable(() => ({
      value: p.field.value_or_zero,
      focused: false,
   }))

   return (
      <InputStringUI
         tw={[
            'w-full',
            field.hasOwnErrors && !field.isInsideDisabledBranch && field.touched && 'rsx-field-error',
         ]}
         icon={config.innerIcon}
         type={config.inputType}
         placeholder={config.placeHolder ?? csuiteConfig.i18n.ui.field.empty}
         pattern={config.pattern}
         className={config.className}
         getValue={() => (uiSt.focused ? uiSt.value : field.value_or_zero)}
         setValue={action((value) => {
            uiSt.value = value
            field.value = value

            if (!value && p.field.canBeToggledWithinParent) {
               p.field.disableSelfWithinParent()
            } else if (value && p.field.canBeToggledWithinParent) {
               p.field.enableSelfWithinParent()
            }
         })}
         disabled={p.readonly || p.field.config.readonly}
         autoResize={config.autoResize}
         buffered={
            field.config.buffered
               ? {
                    getTemporaryValue: (): string | null => field.temporaryValue,
                    setTemporaryValue: (value): void => void (field.temporaryValue = value),
                 }
               : undefined
         }
         onFocus={action(() => {
            uiSt.focused = true
            uiSt.value = field.value_or_zero
         })}
         onBlur={action(() => {
            field.touch()
            uiSt.focused = false
         })}
         noColorStuff
      />
   )
})
