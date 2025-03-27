import type { Field_string } from './FieldString'

import { action } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'

import { csuiteConfig } from '../../config/configureCsuite'
import { useCSuite } from '../../ctx/useCSuite'
import { Frame } from '../../frame/Frame'
import { InputStringUI } from '../../input-string/InputStringUI'

// Textarea HEADER
export const WidgetString_TextareaHeaderUI = obs(function WidgetString_TextareaHeaderUI_(p: {
   field: Field_string
}) {
   const field = p.field
   if (!field.ϟconfig.textarea) return null
   if (!p.field.ϟserial.collapsed) return null
   return <div tw='line-clamp-1 italic opacity-50'>{JSON.stringify(p.field.ϟvalue)}</div>
})

// Textarea BODY
export const WidgetString_TextareaBodyUI = obs(function WidgetString_TextareaBodyUI_(p: {
   field: Field_string
   readonly?: boolean
   config?: Field_string['ϟconfig']
}) {
   const field = p.field
   const csuite = useCSuite()
   const config = p.config ? { ...field.ϟconfig, ...p.config } : field.ϟconfig
   const uiSt = useLocalObservable(() => ({
      focused: false,
      value: field.ϟvalue_or_zero,
   }))

   if (p.readonly) return <pre>{field.ϟvalue_or_zero}</pre>
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
            value={uiSt.focused ? uiSt.value : field.ϟvalue_or_zero}
            onChange={(ev) => {
               field.ϟvalue = ev.target.value
               uiSt.value = ev.target.value
            }}
            onBlur={action(() => {
               field.ϟtouch()
               uiSt.focused = false
            })}
            onFocus={action(() => {
               uiSt.focused = true
               uiSt.value = field.ϟvalue_or_zero
            })}
         />
      </Frame>
   )
})

// string HEADER
export const WidgetString_HeaderUI = obs(function WidgetStringUI_(p: {
   field: Field_string
   readonly?: boolean
   config?: Field_string['ϟconfig']
}) {
   const field = p.field
   const config = p.config ? { ...field.ϟconfig, ...p.config } : field.ϟconfig

   // This is necessary to avoid changing the value while the user is typing something
   const uiSt = useLocalObservable(() => ({
      value: p.field.ϟvalue_or_zero,
      focused: false,
   }))

   return (
      <InputStringUI
         tw={[
            'w-full',
            field.ϟhasOwnErrors && !field.ϟisInsideDisabledBranch && field.ϟtouched && 'rsx-field-error',
         ]}
         icon={config.innerIcon}
         type={config.inputType}
         placeholder={config.placeHolder ?? csuiteConfig.i18n.ui.field.empty}
         pattern={config.pattern}
         className={config.className}
         getValue={() => (uiSt.focused ? uiSt.value : field.ϟvalue_or_zero)}
         setValue={action((value) => {
            uiSt.value = value
            field.ϟvalue = value

            if (!value && p.field.ϟcanBeToggledWithinParent) {
               p.field.ϟdisableSelfWithinParent()
            } else if (value && p.field.ϟcanBeToggledWithinParent) {
               p.field.ϟenableSelfWithinParent()
            }
         })}
         disabled={p.readonly || p.field.ϟconfig.readonly}
         autoResize={config.autoResize}
         buffered={
            field.ϟconfig.buffered
               ? {
                    getTemporaryValue: (): string | null => field.temporaryValue,
                    setTemporaryValue: (value): void => void (field.temporaryValue = value),
                 }
               : undefined
         }
         onFocus={action(() => {
            uiSt.focused = true
            uiSt.value = field.ϟvalue_or_zero
         })}
         onBlur={action(() => {
            field.ϟtouch()
            uiSt.focused = false
         })}
         noColorStuff
      />
   )
})
