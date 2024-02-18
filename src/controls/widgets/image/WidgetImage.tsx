import type { SQLWhere } from 'src/db/SQLWhere'
import type { MediaImageT } from 'src/db/TYPES.gen'
import type { FormBuilder } from '../../FormBuilder'
import type { IWidget_OLD, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers_OLD } from '../../IWidget'
import type { MediaImageL } from 'src/models/MediaImage'

import { makeAutoObservable, reaction, runInAction } from 'mobx'
import { nanoid } from 'nanoid'
import { WidgetDI } from '../WidgetUI.DI'

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
// ...

// STATE
export interface Widget_image extends WidgetTypeHelpers_OLD<'image', Widget_image_config, Widget_image_serial, 0, Widget_image_output> {} // prettier-ignore
export class Widget_image implements IWidget_OLD<'image', Widget_image_config, Widget_image_serial, 0, Widget_image_output> {
    get serialHash() { return this.value.data.hash } // prettier-ignore
    readonly isVerticalByDefault = false
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'image' = 'image'
    readonly serial: Widget_image_serial

    constructor(public form: FormBuilder, public config: Widget_image_config, serial?: Widget_image_serial) {
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
