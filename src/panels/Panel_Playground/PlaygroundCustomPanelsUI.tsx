import type { FormSerial } from '../../controls/FormSerial'

import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'

import { Button } from '../../rsuite/button/Button'
import { registerCustomPanel } from '../Panel_Temporary'
import { usePanelTemporaryData } from '../router/usePanelTemporaryData'

export const PlaygroundCustomPanelsUI = observer(function PlaygroundCustomPanelsUI_(p: {}) {
    return (
        <div tw='flex gap-1'>
            <Button onClick={() => cushy.layout.addCustom(HANDLE, { name: '@rvion' + Math.random() })} icon='mdiAbTesting'>
                Open custom Panel
            </Button>
            <Button onClick={() => cushy.layout.addCustom(HANDLE, { name: '@rvion' })} icon='mdiAbTesting'>
                Open custom Panel
            </Button>
            <hr />
            <Button onClick={() => new Promise((yes) => setTimeout(yes, 2000))}>test</Button>
        </div>
    )
})

const HANDLE = registerCustomPanel(
    'myCustomPanel',
    observer((p: { name: string }) => {
        const store = usePanelTemporaryData((): { data: Maybe<FormSerial> } =>
            observable({
                data: null,
            }),
        )
        console.log(`[🤠] store.data`, store.data)
        const form = cushy.forms.use(
            (ui) =>
                ui.fields({
                    foo: ui.string(),
                    bar: ui.int().list(),
                }),
            {
                name: 'myCustomPanel',
                initialSerial: () => store.data,
                onSerialChange: (form) => {
                    store.data = form.serial
                },
            },
        )
        return (
            <div>
                🟢{p.name}
                {form.render()}
            </div>
        )
    }),
)
