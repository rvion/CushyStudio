import type { BaseSchema } from '../../model/BaseSchema'
import type { SListExt } from './WidgetListExt'

import { observer, useLocalObservable } from 'mobx-react-lite'

export const WidgetListExt_TimelineUI = observer(function WidgetTimelineUI_<T extends BaseSchema>(p: {
    //
    field: SListExt<any>['$Field']
}) {
    //
    const scale = 20
    const TL = p.field
    const value = TL.value
    const entries = TL.fields.items.subFields.map((i) => i.fields)
    const uiSt = useLocalObservable(() => ({
        ix: 0,
    }))
    return (
        <div tw='overflow-auto'>
            <div tw='flex flex-col gap-1' style={{ width: value.area.width * scale }}>
                <div style={{ minHeight: '1rem', width: value.area.width * scale }} tw='timeline-item w-full relative'></div>
                {entries.map(({ shape, value: widget }, ix) => {
                    const { width, x } = shape.value
                    return (
                        <div
                            key={widget.id}
                            style={{ minHeight: '2rem', width: value.area.width * scale }}
                            tw='timeline-item w-full relative'
                        >
                            <div
                                tw={[
                                    //
                                    uiSt.ix == ix ? 'bg-primary text-primary-content' : 'bg-accent text-accent-content',
                                    'cursor-pointer',
                                ]}
                                onClick={() => (uiSt.ix = ix)}
                                style={{
                                    height: '100%',
                                    position: 'absolute',
                                    width: width * scale,
                                    left: x * scale,
                                }}
                            >
                                {JSON.stringify({ duration: width, startAt: x })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
})
