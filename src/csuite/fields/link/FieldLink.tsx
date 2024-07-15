import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { CovariantFn } from '../../variance/BivariantHack'
import type { FC } from 'react'

import { Field, type KeyedField } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// CONFIG
export type Field_link_config<
    //
    A extends BaseSchema,
    B extends BaseSchema,
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
export type Field_link_serial<A extends BaseSchema, B extends BaseSchema> = FieldSerial<{
    $: 'link'
    a?: A['$Serial']
    b?: B['$Serial']
}>

// VALUE
export type Field_link_value<
    /** A value is NOT used; it may be part of B */
    A extends BaseSchema,
    B extends BaseSchema,
> = B['$Value']

// TYPES
export type Field_link_types<A extends BaseSchema, B extends BaseSchema> = {
    $Type: 'link'
    $Config: Field_link_config<A, B>
    $Serial: Field_link_serial<A, B>
    $Value: Field_link_value<A, B>
    $Field: Field_link<A, B>
}

// STATE
export class Field_link<A extends BaseSchema, B extends BaseSchema> //
    extends Field<Field_link_types<A, B>>
{
    static readonly type: 'link' = 'link'

    /** the dict of all child widgets */
    aField!: A['$Field']
    bField!: B['$Field']

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_link<A, B>>,
        serial?: Field_link_serial<A, B>,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {})
    }

    protected setOwnSerial(serial: Maybe<Field_link_serial<A, B>>): void {
        this.RECONCILE({
            existingChild: this.aField,
            correctChildSchema: this.config.share,
            targetChildSerial: serial?.a,
            attach: (child) => {
                this.aField = child
                this.serial.a = child.serial
            },
        })

        this.RECONCILE({
            existingChild: this.bField,
            correctChildSchema: this.config.children(this.aField),
            targetChildSerial: serial?.b,
            attach: (child) => {
                this.bField = child
                this.serial.b = child.serial
            },
        })
    }

    get actualWidgetToDisplay(): Field {
        return this.bField.actualWidgetToDisplay
    }

    DefaultHeaderUI: FC<{}> = () => <>🟢</>

    DefaultBodyUI: FC<{}> = () => this.bField.renderWithLabel()

    get ownProblems(): Problem_Ext {
        return this.bField.hasErrors
    }

    get hasChanges(): boolean {
        return this.bField.hasChanges
    }

    reset(): void {
        this.bField.reset()
    }

    get indentChildren(): number {
        return 0
    }

    get summary(): string {
        return this.bField.summary
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

    get value(): Field_link_value<A, B> {
        return this.bField.value
    }

    set value(val: Field_link_value<A, B>) {
        this.runInAutoTransaction(() => {
            this.bField.value = val
        })
    }
}

// DI
registerFieldClass('link', Field_link)
