import type { SQLWhere } from '../../../db/SQLWhere'
import type { MediaImageT } from '../../../db/TYPES.gen'
import type { MediaImageL } from '../../../models/MediaImage'
import type { Form } from '../../Form'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { makeAutoObservable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
import { Spec } from '../../Spec'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSelectImageUI } from './WidgetImageUI'

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
registerWidgetClass('image', Widget_image)
