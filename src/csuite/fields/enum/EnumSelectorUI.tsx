import type { EnumName, EnumValue } from '../../../comfyui/comfyui-types'
import type { CleanedEnumResult } from '../../../types/EnumUtils'

import { observer } from 'mobx-react-lite'

import { useSt } from '../../../state/stateContext'
import { Ikon } from '../../icons/iconHelpers'
import { MessageErrorUI } from '../../messages/MessageErrorUI'
import { RevealUI } from '../../reveal/RevealUI'
import { SelectUI } from '../../select/SelectUI'

export const EnumSelectorUI = observer(function EnumSelectorUI_(p: {
   value: () => CleanedEnumResult<any>
   // displayValue?: boolean
   // substituteValue?: EnumValue | null
   onChange: (v: EnumValue | null) => void
   clearable?: Maybe<() => void>
   disabled?: boolean
   enumName: EnumName
}) {
   const project = useSt().project
   const schema = project.schema
   const options: EnumValue[] = schema.knownEnumsByName.get(p.enumName)?.values ?? [] // schema.getEnumOptionsForSelectPicker(p.enumName)

   // const valueIsValid = (p.value != null || p.isOptional) && options.some((x) => x.value === p.value)
   const value = p.value()
   const hasError = Boolean(value.isSubstitute || value.ENUM_HAS_NO_VALUES)
   return (
      <div tw={['h-full w-full']}>
         <SelectUI //
            tw={[{ ['rsx-field-error']: hasError }]}
            disabled={p.disabled}
            onCleared={p.clearable}
            options={() => options}
            getLabelText={(v) => v?.toString() ?? 'null'}
            value={() => p.value().candidateValue}
            // hideValue={p.displayValue}
            onOptionToggled={(option) => {
               if (option == null) return
               p.onChange(option)
            }}
         />
         <div tw='flex flex-wrap gap-2'>
            {value.isSubstitute ? ( //
               <RevealUI
                  placement='bottom'
                  content={() => (
                     <MessageErrorUI>
                        <div>
                           <div>
                              <div tw='bord'>{value.candidateValue}</div> is not in your ComfyUI install
                              folder
                           </div>
                           <div>
                              <div tw='bord'>{value.finalValue}</div> used instead
                           </div>
                        </div>
                     </MessageErrorUI>
                  )}
               >
                  <div className='flex items-center text-orange-500'>
                     <Ikon.mdiInformation />
                     <span>{value.finalValue}</span>
                  </div>
               </RevealUI>
            ) : null}
            {value.ENUM_HAS_NO_VALUES ? <div tw='text-red-500'>NO VALUE FOR {p.enumName}</div> : null}
         </div>
      </div>
   )
})
