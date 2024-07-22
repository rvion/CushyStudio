import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'
import { useCSuite } from '../../ctx/useCSuite'

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
}

export const ListControlsUI = observer(function ListControlsUI_(p: {
    //
    field: IWidgetListLike
    children?: React.ReactNode
}) {
    const field = p.field
    const csuite = useCSuite()

    return (
        <div
            tw='sticky flex items-center gap-0.5 top-0 flex z-[50] w-full'
            onMouseDown={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
            }}
        >
            <ListButtonAddUI field={field} />
            {p.children}
            <div tw='flex-1' />
            <ListButtonClearUI field={field} />
            {csuite.showFoldButtons && <ListButtonFoldUI field={field} />}
            {csuite.showFoldButtons && <ListButtonUnfoldUI field={field} />}
            {/* <ListButtonAdd100ItemsUI field={field} /> */}
        </div>
    )
})

export const ListButtonAddUI = observer(function ListButtonAddUI_(p: { field: IWidgetListLike }) {
    const field = p.field
    const max: number | undefined = field.config.max
    const canAdd = max != null ? field.items.length < max : true
    return (
        <Button
            size='input'
            // borderless
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
    )
})

export const ListButtonClearUI = observer(function ListButtonClearUI_(p: { field: IWidgetListLike }) {
    const field = p.field
    const min: number | undefined = field.config.min
    const canClear = min != null ? field.items.length > min : true
    return (
        <Button
            size='input'
            borderless
            subtle
            disabled={!canClear}
            square
            icon='mdiDeleteSweep'
            onClick={(ev) => {
                if (!canClear) return
                ev.stopPropagation()
                field.removeAllItems()
            }}
        />
    )
})
export const ListButtonFoldUI = observer(function ListButtonFoldUI_(p: { field: IWidgetListLike }) {
    const field = p.field
    return (
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
    )
})

export const ListButtonUnfoldUI = observer(function ListButtonUnfoldUI_(p: { field: IWidgetListLike }) {
    const field = p.field
    return (
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
    )
})

export const ListButtonAdd100ItemsUI = observer(function ListButtonAdd100ItemsUI_(p: { field: IWidgetListLike }) {
    const field = p.field
    return (
        <Button
            size='input'
            borderless
            subtle
            square
            icon='mdiUnfoldLessHorizontal'
            onClick={() => {
                runInAction(() => {
                    for (let i = 0; i < 100; i++) field.addItem()
                })
            }}
        >
            Add 100 more
        </Button>
    )
})
