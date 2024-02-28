import type { Widget_listExt } from './WidgetListExt'
import type { Spec } from 'src/controls/Spec'

import { observer, useLocalObservable } from 'mobx-react-lite'

export const WidgetListExt_TimelineUI = observer(function WidgetTimelineUI_<T extends Spec>(p: {
    //
    widget: Widget_listExt<T>
}) {
    //
    const scale = 20
    const widget = p.widget
    const serial = widget.serial
    const uiSt = useLocalObservable(() => ({
        ix: 0,
    }))
    return (
        <div tw='overflow-auto virtualBorder'>
            <div tw='flex flex-col gap-1' style={{ width: serial.width * scale }}>
                <div
                    style={{ minHeight: '1rem', width: serial.width * scale }}
                    tw='bg-base-300 timeline-item w-full relative'
                ></div>
                {widget.entries.map(({ shape: position, widget }, ix) => {
                    return (
                        <div
                            key={widget.id}
                            style={{ minHeight: '2rem', width: serial.width * scale }}
                            tw='bg-base-300 timeline-item w-full relative'
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
                                    width: position.width * scale,
                                    left: position.x * scale,
                                }}
                            >
                                {JSON.stringify({ duration: position.width, startAt: position.x })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
})
