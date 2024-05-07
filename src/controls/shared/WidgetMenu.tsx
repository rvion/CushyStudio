import type { IWidget } from '../IWidget'

import { menu, type Menu } from '../../operators/Menu'
import { SimpleMenuEntry } from '../../operators/menuSystem/SimpleMenuEntry'

export const menu_widgetActions: Menu<IWidget> = menu({
    title: 'widget actions',
    entries: (widget: IWidget) => {
        const createPreset = new SimpleMenuEntry('Create Preset', () => {
            console.log('Create Preset')
        })
        const presets = widget.config.presets
        if (presets == null) return [createPreset]
        const entries = Object.entries(presets)
        if (entries.length === 0) return [createPreset]
        return [
            //
            createPreset,
            ...entries.map(([key, value]) => new SimpleMenuEntry(key, () => value(widget))),
        ]
        // return [
        //     new SimpleMenuEntry('foo', () => console.log('foo')),
        //     new SimpleMenuEntry('bar', () => console.log('foo')),
        //     //
        //     // cmd_copyImage.bind(image),
        //     // menu_copyImageAs.bind(image),
        // ]
    },
})
