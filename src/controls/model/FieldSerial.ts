/** helper to define widget serial types */
export type FieldSerial<X> = X & FieldSerial_CommonProperties

/** common properties we expect to see in a widget serial */
export type FieldSerial_CommonProperties = {
    id?: string
    /** name of the widget, so we can later re-instanciate a widget from this */
    type: string
    /** if true, widget should be displayed folded when it make sense in given context */
    collapsed?: boolean
    /** timestap this widget was last updated */
    lastUpdatedAt?: number
    /** unused internally, here so you can add whatever you want inside */
    custom?: any

    /**
     * DO NOT MANUALLY SET THIS VALUE;
     * this value will be set by the init() function (BaseWidget class)
     * use to know if the onCreate function should be re-run or not
     * */
    _creationKey?: string
}
