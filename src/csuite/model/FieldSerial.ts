/** helper to define widget serial types */
export type FieldSerial<X> = X & FieldSerial_CommonProperties

/** common properties we expect to see in a widget serial */
export type FieldSerial_CommonProperties = {
    /** unique field serial */
    id?: string

    /** name of the widget, so we can later re-instanciate a widget from this */
    type: string

    /** if true, widget should be displayed folded when it make sense in given context */
    collapsed?: boolean

    /** timestap this widget was last updated */
    lastUpdatedAt?: number

    /**
     * DO NOT MANUALLY SET THIS VALUE;
     * this value will be set by the init() function (BaseWidget class)
     * use to know if the onCreate function should be re-run or not
     * */
    _creationKey?: string

    /** unused internally, here so you can add whatever you want inside */
    custom?: any

    // ⏸️ /**
    // ⏸️  * when a field has enableVersionning set to number | true
    // ⏸️  * every changes will be recorded up to number | 10 versions
    // ⏸️  * */
    // ⏸️ _history: { at: Timestamp; version: any }[]
}
