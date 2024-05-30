import type { SQLWhere } from '../../../db/SQLWhere'
import type { MediaImageT } from '../../../db/TYPES.gen'
import type { MediaImageL } from '../../../models/MediaImage'
import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSelectImageUI } from './WidgetImageUI'

// CONFIG
export type Widget_image_config = WidgetConfigFields<
    {
        default?: MediaImageL
        suggestionWhere?: SQLWhere<MediaImageT>
        assetSuggested?: RelativePath | RelativePath[]
    },
    Widget_image_types
>

// SERIAL
export type Widget_image_serial = WidgetSerialFields<{
    type: 'image'
    imageID?: Maybe<MediaImageID>
    imageHash?: string /** for form expiration */
    /** Height of the resizable frame's content, the width is aspect ratio locked. */
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
    $Widget: Widget_image
}

// STATE
export interface Widget_image extends Widget_image_types {} // prettier-ignore
export class Widget_image extends BaseWidget implements IWidget<Widget_image_types> {
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
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_image>,
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
