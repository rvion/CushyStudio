import { observer } from 'mobx-react-lite'

import { Button } from '../../../rsuite/button/Button'

export type IWidgetListLike = {
    addItem(): void
    removeAllItems(): void
    expandAllItems(): void
    collapseAllItems(): void
    items: unknown[]
    readonly length: number
    config: {
        max?: number
        min?: number
    }
} //Widget_listExt<any> | Widget_list<any>

export const ListControlsUI = observer(function ListControlsUI_(p: { widget: IWidgetListLike }) {
    const widget = p.widget
    const max = widget.config.max
    const min = widget.config.min
    const canAdd = max ? widget.items.length < max : true
    const canClear = min ? widget.items.length > min : true
    return (
        <div
            tw='sticky top-0 flex z-[50] w-full'
            onMouseDown={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
            }}
        >
            <Button
                ghost
                disabled={!canAdd}
                square
                icon='mdiPlus'
                onClick={(ev) => {
                    if (!canAdd) return
                    ev.stopPropagation()
                    widget.addItem()
                }}
            />
            <Button
                ghost
                disabled={!canClear}
                square
                icon='mdiDeleteForever'
                onClick={(ev) => {
                    if (!canClear) return
                    ev.stopPropagation()
                    widget.removeAllItems()
                }}
            />
            <Button
                ghost
                square
                icon='mdiUnfoldMoreHorizontal'
                // tw={['btn btn-xs btn-narrow btn-ghost']}
                onClick={(ev) => {
                    ev.stopPropagation()
                    widget.expandAllItems()
                }}
            />
            <Button
                ghost
                square
                icon='mdiUnfoldLessHorizontal'
                onClick={(ev) => {
                    ev.stopPropagation()
                    widget.collapseAllItems()
                }}
            />
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
