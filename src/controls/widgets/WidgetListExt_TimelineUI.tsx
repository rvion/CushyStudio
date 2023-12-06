import { observer, useLocalObservable } from 'mobx-react-lite'
import { Widget, Widget_listExt } from 'src/controls/Widget'

export const WidgetListExt_TimelineUI = observer(function WidgetTimelineUI_<T extends Widget>(p: { req: Widget_listExt<T> }) {
    //
    const scale = 20
    const prs = p.req.state
    const uiSt = useLocalObservable(() => ({
        ix: 0,
    }))
    return (
        <div tw='overflow-auto virtualBorder'>
            <div tw='flex flex-col gap-1' style={{ width: prs.width * scale }}>
                <div style={{ minHeight: '1rem', width: prs.width * scale }} tw='bg-base-300 timeline-item w-full relative'></div>
                {prs.items.map((x, ix) => {
                    return (
                        <div
                            key={x.item.id}
                            style={{ minHeight: '2rem', width: prs.width * scale }}
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
                                    width: x.width * scale,
                                    left: x.x * scale,
                                }}
                            >
                                {JSON.stringify({ duration: x.width, startAt: x.x })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
})
