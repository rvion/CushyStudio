import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'
import type { CovariantFn } from '../../variance/BivariantHack'

import { runInAction } from 'mobx'

import { Field, type KeyedField } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'

// CONFIG
export type Field_link_config<
    //
    A extends ISchema,
    B extends ISchema,
> = FieldConfig<
    {
        // injected
        share: A

        // into
        children: CovariantFn<[child: A['$Field']], B>
    },
    Field_link_types<A, B>
>

// SERIAL
export type Field_link_serial<A extends ISchema, B extends ISchema> = FieldSerial<{
    type: 'link'
    a?: A['$Serial']
    b?: B['$Serial']
}>

// VALUE
export type Field_link_value<
    //
    A extends ISchema,
    B extends ISchema,
> = B['$Value']

// TYPES
export type Field_link_types<A extends ISchema, B extends ISchema> = {
    $Type: 'link'
    $Config: Field_link_config<A, B>
    $Serial: Field_link_serial<A, B>
    $Value: Field_link_value<A, B>
    $Field: Field_link<A, B>
}

// STATE
export class Field_link<A extends ISchema, B extends ISchema> //
    extends Field<Field_link_types<A, B>>
{
    DefaultHeaderUI = () => <>🟢</>
    DefaultBodyUI = () => this.bField.renderWithLabel()

    get baseErrors(): Problem_Ext { return this.bField.hasErrors } // prettier-ignore
    get hasChanges(): boolean { return this.bField.hasChanges } // prettier-ignore

    reset(): void {
        this.bField.reset()
    }

    get indentChildren(): number {
        return 0
    }

    get summary(): string {
        return this.bField.summary
    }

    static readonly type: 'link' = 'link'

    /** the dict of all child widgets */
    aField!: A['$Field']
    bField!: B['$Field']

    private _defaultSerial = (): Field_link_serial<A, B> => {
        return {
            type: 'link',
        }
    }
    constructor(
        //
        entity: Entity,
        parent: Field | null,
        schema: ISchema<Field_link<A, B>>,
        serial?: Field_link_serial<A, B>,
    ) {
        super(entity, parent, schema)
        this.serial =
            serial && serial.type === 'link' //
                ? serial
                : this._defaultSerial()

        const aSchema = this.config.share
        this.aField = aSchema.instanciate(this.entity, this, this.serial.a)
        this.serial.a = this.aField.serial // hook a serial

        const bSchema = this.config.children(this.aField)
        this.bField = bSchema.instanciate(this.entity, this, this.serial.b)
        this.serial.b = this.bField.serial // hook a serial

        this.init({})
    }

    get subFields(): [A['$Field'], B['$Field']] {
        return [this.aField, this.bField]
    }

    get subFieldsWithKeys(): KeyedField[] {
        return [
            { key: 'a', field: this.aField },
            { key: 'b', field: this.bField },
        ]
    }

    set value(val: Field_link_value<A, B>) {
        runInAction(() => {
            this.bField.value = val
            this.applyValueUpdateEffects()
        })
    }

    get value() {
        return this.bField.value
    }
}

// DI
registerWidgetClass('link', Field_link)
