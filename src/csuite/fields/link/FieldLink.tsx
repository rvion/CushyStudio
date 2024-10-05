import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { CovariantFn } from '../../variance/BivariantHack'
import type { FC } from 'react'

import { reaction } from 'mobx'

import { Field, type KeyedField } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// #region CONFIG TYPE
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
        dynamic?: (a: Field /* 🔴 variance issue but the right type is: A['$Field'] */) => any
    },
    Field_link_types<A, B>
>

// #region SERIAL TYPE
export type Field_link_serial<A extends BaseSchema, B extends BaseSchema> = FieldSerial<{
    $: 'link'
    a?: A['$Serial']
    b?: B['$Serial']
}>

// #region VALUE TYPE
export type Field_link_value<
    /** A value is NOT used; it may be part of B */
    A extends BaseSchema,
    B extends BaseSchema,
> = B['$Value']
export type Field_link_unchecked<
    //
    A extends BaseSchema,
    B extends BaseSchema,
> = B['$Unchecked']

// #region $FieldType
export type Field_link_types<A extends BaseSchema, B extends BaseSchema> = {
    $Type: 'link'
    $Config: Field_link_config<A, B>
    $Serial: Field_link_serial<A, B>
    $Value: B['$Value']
    $Field: Field_link<A, B>
    $Unchecked: Field_link_unchecked<A, B>
    $Child: B
    $Reflect: Field_link_types<A, B>
}

// #region STATE
export class Field_link<
        //
        A extends BaseSchema,
        B extends BaseSchema,
    > //
    extends Field<Field_link_types<A, B>>
{
    // #region TYPE
    static readonly type: 'link' = 'link'
    static readonly emptySerial: Field_link_serial<any, any> = { $: 'link' }
    static migrateSerial(): undefined {}

    // #region CTOR
    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_link<A, B>>,
        initialMountKey: string,
        serial?: Field_link_serial<A, B>,
    ) {
        super(repo, root, parent, schema, initialMountKey, serial)
        this.init(serial, {})

        const dynamicFn = this.config.dynamic
        if (dynamicFn != null) {
            const cleanup = reaction(
                () => dynamicFn(this.aField),
                () => {
                    this.RECONCILE({
                        mountKey: 'b',
                        existingChild: this.bField,
                        correctChildSchema: this.config.children(this.aField),
                        targetChildSerial: serial?.b,
                        attach: (child) => {
                            this.bField = child
                            this.patchSerial((draft) => void (draft.b = child.serial))
                        },
                    })
                },
            )
            this.disposeFns.push(cleanup)
        }
    }

    // #region children
    /** the dict of all child widgets */
    aField!: A['$Field']
    bField!: B['$Field']

    // #region serial
    protected setOwnSerial(next: Field_link_serial<A, B>): void {
        this.assignNewSerial(next)

        this.RECONCILE({
            mountKey: 'a',
            existingChild: this.aField,
            correctChildSchema: this.config.share,
            targetChildSerial: next.a,
            attach: (child) => {
                this.aField = child
                this.patchSerial((draft) => void (draft.a = child.serial))
            },
        })

        this.RECONCILE({
            mountKey: 'b',
            existingChild: this.bField,
            correctChildSchema: this.config.children(this.aField),
            targetChildSerial: next.b,
            attach: (child) => {
                this.bField = child
                this.patchSerial((draft) => void (draft.b = child.serial))
            },
        })
    }

    // #region UI
    DefaultHeaderUI = undefined
    DefaultBodyUI: FC<{}> = () => this.bField.UI() // 🔴 Not sure how to use `Render` properly here

    get actualWidgetToDisplay(): Field {
        return this.bField.actualWidgetToDisplay
    }

    // #region Validation
    get ownConfigSpecificProblems(): Problem_Ext {
        return null
    }

    get ownTypeSpecificProblems(): Problem_Ext {
        return [this.aField.ownTypeSpecificProblems, this.bField.ownTypeSpecificProblems]
    }

    get isOwnSet(): boolean {
        return this.bField.isSet
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

    // #region children

    _acknowledgeNewChildSerial(mountKey: string, serial: any): boolean {
        if (mountKey === 'a') {
            const didChange = this.patchSerial((draft) => void (draft.a = serial))
            return didChange
        }
        if (mountKey === 'b') {
            const didChange = this.patchSerial((draft) => void (draft.b = serial))
            return didChange
        }
        throw new Error(`[❌] invalid mountKey: ${mountKey}`)
    }

    get childrenAll(): [A['$Field'], B['$Field']] {
        return [this.aField, this.bField]
    }

    get subFieldsWithKeys(): KeyedField[] {
        return [
            { key: 'a', field: this.aField },
            { key: 'b', field: this.bField },
        ]
    }

    // #region value
    get value(): Field_link_value<A, B> {
        return this.value_or_fail
    }

    set value(val: Field_link_value<A, B>) {
        this.runInAutoTransaction(() => {
            this.bField.value = val
        })
    }

    get value_or_fail(): Field_link_value<A, B> {
        return this.bField.value_or_fail
    }
    get value_or_zero(): Field_link_value<A, B> {
        return this.bField.value_or_zero
    }
    get value_unchecked(): Field_link_unchecked<A, B> {
        return this.bField.value_unchecked
    }
}

// DI
registerFieldClass('link', Field_link)
