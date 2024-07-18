import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export type IWidgetListLike = {
    addItem(): void
    removeAllItems(): void
    expandAllChildren(): void
    collapseAllChildren(): void
    items: unknown[]
    readonly length: number
    config: {
        max?: number
        min?: number
    }
} //Field_listExt<any> | Field_list<any>

export const ListControlsUI = observer(function ListControlsUI_(p: { field: IWidgetListLike }) {
    const field = p.field
    const max = field.config.max
    const min = field.config.min
    const canAdd = max ? field.items.length < max : true
    const canClear = min ? field.items.length > min : true
    return (
        <div
            tw='sticky flex gap-0.5 top-0 flex z-[50] w-full'
            onMouseDown={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
            }}
        >
            <Button
                size='input'
                borderless
                subtle
                disabled={!canAdd}
                square
                icon='mdiPlus'
                onClick={(ev) => {
                    if (!canAdd) return
                    ev.stopPropagation()
                    field.addItem()
                }}
            />
            <Button
                size='input'
                borderless
                subtle
                disabled={!canClear}
                square
                icon='mdiDeleteOutline'
                onClick={(ev) => {
                    if (!canClear) return
                    ev.stopPropagation()
                    field.removeAllItems()
                }}
            />
            <Button
                size='input'
                borderless
                subtle
                square
                icon='mdiUnfoldMoreHorizontal'
                onClick={(ev) => {
                    ev.stopPropagation()
                    field.expandAllChildren()
                }}
            />
            <Button
                size='input'
                borderless
                subtle
                square
                icon='mdiUnfoldLessHorizontal'
                onClick={(ev) => {
                    ev.stopPropagation()
                    field.collapseAllChildren()
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
