import type { SQLWhere } from '../../../db/SQLWhere'
import type { MediaImageT } from '../../../db/TYPES.gen'
import type { MediaImageL } from '../../../models/MediaImage'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { IBlueprint } from '../../model/IBlueprint'
import type { Model } from '../../model/Model'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSelectImageUI } from './WidgetImageUI'

// CONFIG
export type Widget_image_config = FieldConfig<
    {
        default?: MediaImageL
        suggestionWhere?: SQLWhere<MediaImageT>
        assetSuggested?: RelativePath | RelativePath[]
    },
    Widget_image_types
>

// SERIAL
export type Widget_image_serial = FieldSerial<{
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
export type Widget_image_value = MediaImageL

// TYPES
export type Widget_image_types = {
    $Type: 'image'
    $Config: Widget_image_config
    $Serial: Widget_image_serial
    $Value: Widget_image_value
    $Field: Widget_image
}

// STATE
export class Widget_image extends BaseField<Widget_image_types> {
    DefaultHeaderUI = WidgetSelectImageUI
    DefaultBodyUI = undefined
    readonly id: string

    readonly type: 'image' = 'image'
    readonly serial: Widget_image_serial
    // size: number = 192
    get baseErrors(): Problem_Ext {
        return null
    }

    get defaultValue(): MediaImageL {
        return this.config.default ?? cushy.defaultImage
    }
    get hasChanges() {
        return this.value !== this.defaultValue
    }
    reset = () => {
        this.value = this.defaultValue
    }

    constructor(
        //
        public readonly form: Model,
        public readonly parent: BaseField | null,
        public readonly spec: IBlueprint<Widget_image>,
        serial?: Widget_image_serial,
    ) {
        super()
        this.id = serial?.id ?? nanoid()
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
    setValue(val: MediaImageL) {
        this.value = val
    }
    set value(next: MediaImageL) {
        if (this.serial.imageID === next.id) return
        runInAction(() => {
            this.serial.imageID = next.id
            this.bumpValue()
        })
    }

    set size(val: number) {
        this.serial.size = val
        this.bumpSerial()
    }
    get size() {
        return this.serial.size
    }
}

// DI
registerWidgetClass('image', Widget_image)
