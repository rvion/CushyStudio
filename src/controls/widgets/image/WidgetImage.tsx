import type { Form } from '../../Form'
import type { IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { IWidget } from 'src/controls/IWidget'
import type { SQLWhere } from 'src/db/SQLWhere'
import type { MediaImageT } from 'src/db/TYPES.gen'
import type { MediaImageL } from 'src/models/MediaImage'

import { makeAutoObservable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetSelectImageUI } from './WidgetImageUI'
import { applyWidgetMixinV2 } from 'src/controls/Mixins'
import { Spec } from 'src/controls/Spec'

// CONFIG
export type Widget_image_config = WidgetConfigFields<
    {
        defaultActive?: boolean
        suggestionWhere?: SQLWhere<MediaImageT>
        assetSuggested?: RelativePath
    },
    Widget_image_types
>

// SERIAL
export type Widget_image_serial = WidgetSerialFields<{
    type: 'image'
    imageID?: Maybe<MediaImageID>
    imageHash?: string /** for form expiration */
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
export interface Widget_image extends Widget_image_types, IWidgetMixins {} // prettier-ignore
export class Widget_image implements IWidget<Widget_image_types> {
    DefaultHeaderUI = WidgetSelectImageUI
    DefaultBodyUI = undefined
    static Prop = <T extends Widget_image>(config: Widget_image_config) => new Spec('image', config)
    get serialHash() { return this.value.data.hash } // prettier-ignore
    readonly id: string
    readonly type: 'image' = 'image'
    readonly serial: Widget_image_serial

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public config: Widget_image_config,
        serial?: Widget_image_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'image',
            id: this.id,
            imageID: cushy.defaultImage.id,
        }
        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }
    get value(): Widget_image_value {
        return cushy.db.media_image.get(this.serial.imageID)!
    }
    set value(next: MediaImageL) {
        if (this.serial.imageID === next.id) return
        runInAction(() => {
            this.serial.imageID = next.id
            this.bumpValue()
        })
    }
}

// DI
WidgetDI.Widget_image = Widget_image
