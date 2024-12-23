import { observable } from 'mobx'

export const sampleInputStringUIProps = observable({
   // get / set value
   value: '',
   getValue: () => sampleInputStringUIProps.value,
   setValue: (next: string) => {
      sampleInputStringUIProps.value = next
   },
   // get / set buffered value
   temporaryValue: null as string | null,
   buffered: {
      getTemporaryValue: (): string | null => sampleInputStringUIProps.temporaryValue,
      setTemporaryValue: (nextTemp: string | null) => {
         sampleInputStringUIProps.temporaryValue = nextTemp
      },
   },
})
