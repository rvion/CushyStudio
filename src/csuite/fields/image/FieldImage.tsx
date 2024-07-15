import type { SQLWhere } from '../../../db/SQLWhere'
import type { MediaImageT } from '../../../db/TYPES.gen'
import type { MediaImageL } from '../../../models/MediaImage'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetSelectImageUI } from './WidgetImageUI'

// CONFIG
export type Field_image_config = FieldConfig<
    {
        default?: MediaImageL
        suggestionWhere?: SQLWhere<MediaImageT>
        assetSuggested?: RelativePath | RelativePath[]
    },
    Field_image_types
>

// SERIAL
export type Field_image_serial = FieldSerial<{
    $: 'image'
    imageID?: Maybe<MediaImageID>

    /** for form expiration */
    imageHash?: string

    /**
     * Height of the resizable frame's content,
     * the width is aspect ratio locked.
     */
    size: number
}>

// VALUE
export type Field_image_value = MediaImageL

// TYPES
export type Field_image_types = {
    $Type: 'image'
    $Config: Field_image_config
    $Serial: Field_image_serial
    $Value: Field_image_value
    $Field: Field_image
}

// STATE
export class Field_image extends Field<Field_image_types> {
    static readonly type: 'image' = 'image'

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_image>,
        serial?: Field_image_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_image_serial>): void {
        this.serial.size = serial?.size ?? this._defaultPreviewSize()
        this.serial.imageID = serial?.imageID ?? this._defaultImageID()
    }

    DefaultHeaderUI = WidgetSelectImageUI

    DefaultBodyUI = undefined

    get ownProblems(): Problem_Ext {
        return null
    }

    get defaultValue(): MediaImageL {
        return this.config.default ?? cushy.defaultImage
    }

    get hasChanges(): boolean {
        return this.value !== this.defaultValue
    }

    private _defaultImageID(): MediaImageID {
        return this.config.default?.id ?? cushy.defaultImage.id
    }

    private _defaultPreviewSize(): number {
        return 128
    }

    get animateResize(): boolean {
        return false
    }

    get value(): MediaImageL {
        return cushy.db.media_image.get(this.serial.imageID)!
    }

    set value(next: MediaImageL) {
        if (this.serial.imageID === next.id) return
        this.runInValueTransaction(() => (this.serial.imageID = next.id))
    }

    set size(val: number) {
        this.runInSerialTransaction(() => (this.serial.size = val))
    }

    /** size of the preview */
    get size(): number {
        return this.serial.size
    }
}

// DI
registerFieldClass('image', Field_image)
