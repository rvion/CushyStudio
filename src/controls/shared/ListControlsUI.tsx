import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Widget_list, Widget_listExt } from 'src/controls/Widget'
import { Button, Joined } from 'src/rsuite/shims'

export const ListControlsUI = observer(function ListControlsUI_(p: {
    //
    req: Widget_listExt<any> | Widget_list<any>
}) {
    const req = p.req
    const values = req.state.items
    const max = req.input.max
    const min = req.input.min
    return (
        <Joined tw='sticky top-0 z-[100] bg-neutral bg-opacity-100 opacity-100'>
            <Button
                tw='btn-sm join-item btn-ghost'
                disabled={max ? req.state.items.length >= max : undefined}
                icon={<span className='material-symbols-outlined'>add</span>}
                onClick={() => req.addItem()}
            >
                Add
            </Button>
            <Button
                tw='btn-sm join-item btn-ghost'
                disabled={min ? req.state.items.length <= min : undefined}
                icon={<span className='material-symbols-outlined'>delete_forever</span>}
                onClick={() => req.removemAllItems()}
            >
                Clear
            </Button>
            <Button
                tw='btn-sm join-item btn-ghost'
                icon={<span className='material-symbols-outlined'>unfold_less</span>}
                onClick={() => req.collapseAllItems()}
            >
                Collapse all
            </Button>
            <Button
                tw='btn-sm join-item btn-ghost'
                icon={<span className='material-symbols-outlined'>unfold_more</span>}
                onClick={() => req.expandAllItems()}
            >
                Expand All
            </Button>
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
        </Joined>
    )
})
