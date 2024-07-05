import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Repository } from '../../model/Repository'
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
    /** A value is NOT used; it may be part of B */
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
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: ISchema<Field_link<A, B>>,
        serial?: Field_link_serial<A, B>,
    ) {
        super(repo, root, parent, schema)
        this.initSerial(serial)
        this.init({})
    }

    protected setOwnSerial(serial: Maybe<Field_link_serial<A, B>>) {
        let aField: A['$Field'] = this.aField
        if (aField != null) {
            aField.updateSerial(serial?.a)
        } else {
            const aSchema: A = this.config.share
            aField = aSchema.instanciate(this.repo, this.root, this, this.serial.a)
            this.aField = aField
            this.serial.a = aField.serial
        }

        // 🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
        // 🔴 ARGH ARGH ARGH
        // what if the bField yields a different schema (different type)
        // we need to make sure the bField can properly be reused first
        const bSchema: B = this.config.children(aField)

        let bField: B['$Field'] = this.bField
        if (bField != null && bField.type === bSchema.type) {
            // 🔴 que se passe t'il si meme racine mais sous-champ différent
            bField.updateSerial(serial?.a)
        } else {
            bField = bSchema.instanciate(this.repo, this.root, this, this.serial.a)
            this.bField = bField
            this.serial.a = bField.serial
        }
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
