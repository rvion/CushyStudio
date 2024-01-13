import { observer } from 'mobx-react-lite'
import { Widget_list, Widget_listExt } from 'src/controls/Widget'
import { Button } from 'src/rsuite/shims'

export const ListControlsUI = observer(function ListControlsUI_(p: {
    //
    widget: Widget_listExt<any> | Widget_list<any>
}) {
    const widget = p.widget
    const values = widget.state.items
    const max = widget.input.max
    const min = widget.input.min
    return (
        <div tw='sticky top-0 z-[100] w-full'>
            <Button
                tw='btn-sm join-item btn-ghost btn-square'
                disabled={max ? widget.state.items.length >= max : undefined}
                icon={<span className='material-symbols-outlined'>add</span>}
                onClick={(ev) => {
                    ev.stopPropagation()
                    widget.addItem()
                }}
            >
                {/* Add */}
            </Button>
            <Button
                tw='btn-sm join-item btn-ghost btn-square'
                disabled={min ? widget.state.items.length <= min : undefined}
                icon={<span className='material-symbols-outlined'>delete_forever</span>}
                onClick={(ev) => {
                    ev.stopPropagation()
                    widget.removemAllItems()
                }}
            >
                {/* Clear */}
            </Button>
            <Button
                tw='btn-sm join-item btn-ghost btn-square'
                icon={<span className='material-symbols-outlined'>unfold_more</span>}
                onClick={(ev) => {
                    ev.stopPropagation()
                    widget.expandAllItems()
                }}
            ></Button>
            <Button
                tw='btn-sm join-item btn-ghost btn-square'
                icon={<span className='material-symbols-outlined'>unfold_less</span>}
                onClick={(ev) => {
                    ev.stopPropagation()
                    widget.collapseAllItems()
                }}
            ></Button>
            {/* <Button
                tw='btn-sm join-item btn-ghost'
                disabled={max ? req.state.items.length >= max : undefined}
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
