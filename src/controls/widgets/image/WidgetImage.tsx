import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { SQLWhere } from 'src/db/SQLWhere'
import type { MediaImageT } from 'src/db/TYPES.gen'
import type { MediaImageL } from 'src/models/MediaImage'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetSelectImageUI } from './WidgetImageUI'
import { Spec } from 'src/controls/Spec'

// CONFIG
export type Widget_image_config = WidgetConfigFields<{
    defaultActive?: boolean
    suggestionWhere?: SQLWhere<MediaImageT>
    assetSuggested?: RelativePath
}>

// SERIAL
export type Widget_image_serial = WidgetSerialFields<{
    type: 'image'
    imageID?: Maybe<MediaImageID>
    imageHash?: string /** for form expiration */
}>

// OUT
export type Widget_image_output = MediaImageL

// TYPES
export type Widget_image_types = {
    $Type: 'image'
    $Input: Widget_image_config
    $Serial: Widget_image_serial
    $Output: Widget_image_output
    $Widget: Widget_image
}

// STATE
export interface Widget_image extends Widget_image_types {} // prettier-ignore
export class Widget_image implements IWidget<Widget_image_types> {
    HeaderUI = WidgetSelectImageUI
    BodyUI = undefined
    static Prop = <T extends Widget_image>(config: Widget_image_config) => new Spec('image', config)
    get serialHash() { return this.value.data.hash } // prettier-ignore
    readonly id: string
    readonly type: 'image' = 'image'
    readonly serial: Widget_image_serial

    constructor(
        //
        public form: Form<any>,
        public config: Widget_image_config,
        serial?: Widget_image_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'image',
            id: this.id,
            imageID: cushy.defaultImage.id,
        }
        makeAutoObservable(this)
    }
    get value(): Widget_image_output {
        return cushy.db.media_images.get(this.serial.imageID)!
    }
}

// DI
WidgetDI.Widget_image = Widget_image
