import type { Widget_listExt } from '../listExt/WidgetListExt'
import type { Widget_list } from './WidgetList'

import { observer } from 'mobx-react-lite'

export const ListControlsUI = observer(function ListControlsUI_(p: { widget: Widget_listExt<any> | Widget_list<any> }) {
    const widget = p.widget
    const max = widget.config.max
    const min = widget.config.min
    const canAdd = max ? widget.items.length < max : true
    const canClear = min ? widget.items.length > min : true
    return (
        <div
            tw='sticky top-0 flex gap-1 z-[50] w-full'
            onMouseDown={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
            }}
        >
            <div
                tw={[!canAdd && 'btn-disabled', 'btn btn-xs btn-narrow btn-ghost']}
                onClick={(ev) => {
                    if (!canAdd) return
                    ev.stopPropagation()
                    widget.addItem()
                }}
            >
                <span className='material-symbols-outlined'>add</span>
            </div>
            <div
                tw={[!canClear && 'btn-disabled', 'btn btn-xs btn-narrow btn-ghost']}
                onClick={(ev) => {
                    if (!canClear) return
                    ev.stopPropagation()
                    widget.removemAllItems()
                }}
            >
                <span className='material-symbols-outlined'>delete_forever</span>
            </div>
            <div
                tw={['btn btn-xs btn-narrow btn-ghost']}
                onClick={(ev) => {
                    ev.stopPropagation()
                    widget.expandAllItems()
                }}
            >
                <span className='material-symbols-outlined'>unfold_more</span>
            </div>
            <div
                tw={['btn btn-xs btn-narrow btn-ghost']}
                onClick={(ev) => {
                    ev.stopPropagation()
                    widget.collapseAllItems()
                }}
            >
                <span className='material-symbols-outlined'>unfold_less</span>
            </div>
            {/* <Button
                tw='btn-sm join-item btn-ghost'
                disabled={max ? req.items.length >= max : undefined}
                icon={<span className='material-symbols-outlined'>add</span>}
                onClick={() => {
                    runInAction(() => {
                        for (let i = 0; i < 100; i++) req.addItem()
                    })
                }}
            >
                Add 100 more
            </Button> */}
        </div>
    )
})
