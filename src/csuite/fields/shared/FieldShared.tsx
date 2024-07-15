import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// CONFIG
export type Field_shared_config<F extends Field> = FieldConfig<
    //
    { field: F },
    Field_shared_types<F>
>

// SERIAL
export type Field_shared_serial = FieldSerial<{
    $: 'shared'
    // NO VALUE HERE; otherwise, we would store the data twice
}>

// SERIAL FROM VALUE
export const Field_shared_fromValue = (val: Field_shared_value): Field_shared_serial => ({
    $: 'shared',
})

// VALUE
export type Field_shared_value<F extends Field = Field> = F['$Value']

// TYPES
export type Field_shared_types<F extends Field = Field> = {
    $Type: 'shared'
    $Config: Field_shared_config<F>
    $Serial: Field_shared_serial
    $Value: Field_shared_value<F>
    $Field: Field_shared<F>
}

// STATE
export class Field_shared<F extends Field = Field> extends Field<Field_shared_types<F>> {
    static readonly type: 'shared' = 'shared'

    readonly DefaultHeaderUI = undefined
    readonly DefaultBodyUI = undefined

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_shared<F>>,
        serial?: Field_shared_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(_serial: Maybe<Field_shared_serial>): void {}

    get hasChanges(): boolean {
        return this.shared.hasChanges ?? false
    }

    get actualWidgetToDisplay(): Field {
        return this.shared.actualWidgetToDisplay
    }

    get shared(): F {
        return this.config.field
    }

    get ownProblems(): Problem_Ext {
        return this.shared.ownProblems
    }

    get value(): Field_shared_value<F> {
        return this.shared.value
    }

    set value(val: Field_shared_value<F>) {
        this.shared.value = val
    }
}

// DI
registerFieldClass('shared', Field_shared)
