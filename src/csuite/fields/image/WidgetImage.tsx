import type { SQLWhere } from '../../../db/SQLWhere'
import type { MediaImageT } from '../../../db/TYPES.gen'
import type { MediaImageL } from '../../../models/MediaImage'
import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
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
    type: 'image'
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
    DefaultHeaderUI = WidgetSelectImageUI
    DefaultBodyUI = undefined

    // size: number = 192
    get baseErrors(): Problem_Ext {
        return null
    }

    get defaultValue(): MediaImageL {
        return this.config.default ?? cushy.defaultImage
    }
    get hasChanges(): boolean {
        return this.value !== this.defaultValue
    }
    reset(): void {
        this.value = this.defaultValue
    }

    constructor(
        //
        entity: Entity,
        parent: Field | null,
        schema: ISchema<Field_image>,
        serial?: Field_image_serial,
    ) {
        super(entity, parent, schema)
        this.serial = serial ?? {
            type: 'image',
            id: this.id,
            imageID: this.config.default?.id ?? cushy.defaultImage.id,
            size: 128,
        }
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }
    get animateResize() {
        return false
    }

    get value(): MediaImageL {
        return cushy.db.media_image.get(this.serial.imageID)!
    }

    set value(next: MediaImageL) {
        if (this.serial.imageID === next.id) return
        runInAction(() => {
            this.serial.imageID = next.id
            this.applyValueUpdateEffects()
        })
    }

    set size(val: number) {
        this.serial.size = val
        this.applySerialUpdateEffects()
    }
    get size() {
        return this.serial.size
    }
}

// DI
registerWidgetClass('image', Field_image)
