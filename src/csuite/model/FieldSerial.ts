import type { FieldAnomaly } from '../migration/Anomaly'
import type { Field } from './Field'

/** helper to define widget serial types */
export type FieldSerialFor<F extends Field> = FieldSerial_CommonProperties & F['$ownSerial']

/** common properties we expect to see in a widget serial */
export type FieldSerial_CommonProperties = {
   /** name of the widget, so we can later re-instanciate a widget from this */
   $: string

   /** if true, widget should be displayed folded when it make sense in given context */
   collapsed?: boolean

   /** timestap this widget was last updated, is used */
   lastUpdatedAt?: number

   /**
    * DO NOT MANUALLY SET THIS VALUE;
    * this value will be set by the init() function (BaseWidget class)
    * use to know if the beforeInit function should be re-run or not
    * */
   _version?: string
   _shared?: any

   /** unused internally, here so you can add whatever you want inside */
   custom?: any

   // 🔴
   snapshot?: any
   // ⏸️ /**
   // ⏸️  * when a field has enableVersionning set to number | true
   // ⏸️  * every changes will be recorded up to number | 10 versions
   // ⏸️  * */
   // ⏸️ _history: { at: Timestamp; version: any }[]

   anomalies?: FieldAnomaly[]
}

export function isFieldSerial(x: object): x is FieldSerial_CommonProperties {
   return (
      typeof x === 'object' &&
      Object.prototype.hasOwnProperty.call(x, '$') &&
      typeof (x as { $: any })['$'] === 'string'
   )
}
