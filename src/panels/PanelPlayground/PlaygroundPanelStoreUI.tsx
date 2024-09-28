import type { PanelState } from '../../router/PanelState'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { PanelStateByNode } from '../../router/PanelStateByNode'
import { PanelStateDebugUI } from '../../router/PanelStateDebugUI'
import { usePanel } from '../../router/usePanel'

export const PlaygroundPanelStoreUI = observer(function PlaygroundPanelStoreUI_(p: {}) {
    const panel = usePanel()

    const test1 = panel.usePersistentStore('abcd', () => ({
        x: 1,
    }))

    const test2 = panel.usePersistentModel('efgh', (ui) =>
        ui.fields({
            foo: ui.string(),
            bar: ui.fields({
                baz: ui.int().list({ min: 1 }),
            }),
        }),
    )

    return (
        <Frame col tw='gap-2'>
            <ShowAllPanelConfigsUI />
            <Frame>panel URI: {panel.uri}</Frame>
            <Frame row tw='gap-2'>
                <Button size='lg' onClick={() => test1.saveData({ x: test1.data.x + 1 })}>
                    Incc {test1.data.x}
                </Button>
                <Frame base border expand>
                    {test2.UI()}
                </Frame>
            </Frame>
            <PanelStateDebugUI panel={panel} />
            {cushy.layout.traverse({})}
        </Frame>
    )
})

export const ShowAllPanelConfigsUI = observer(function ShowAllPanelConfigsUI_(p: {}) {
    let OUT: { id: string; ps: Maybe<PanelState> }[] = []
    cushy.layout.traverse({
        onTab(tab) {
            // console.log(`[🔶🔶] `, tab.getId(), [...PanelStateByNode.keys()])
            const id = tab.getId()
            const ps = PanelStateByNode.get(id)
            OUT.push({ id, ps })
            return null
        },
    })
    return (
        <div>
            {OUT.map((x) => {
                const { ps, id } = x
                if (ps == null)
                    return (
                        <Button look='error' disabled>
                            {id}
                        </Button>
                    )
                return (
                    <RevealUI trigger='hover' showDelay={0} key={id} content={() => <PanelStateDebugUI panel={ps} />}>
                        <Button>{id}</Button>
                    </RevealUI>
                )
            })}
        </div>
    )
})
