import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { isFieldNumber } from '../../csuite/fields/WidgetUI.DI'
import { usePanel } from '../../router/usePanel'

export const PlaygroundRenderUI = observer(function PlaygroundRender(p: NO_PROPS) {
    const x = usePanel().usePersistentModel('foobar', (b) =>
        b.fields({
            a0: b.prompt(),
            x: b.string(),
            y: b.int(),
            z: b.percent(),
            sub1: b.fields({ x: b.string(), y: b.int(), z: b.percent() }),
            sub2: b.fields({ x: b.string(), y: b.int(), z: b.percent() }),
        }),
    )
    return (
        <div>
            <x.Render
                // Body='hello'
                children={({ fields: f }) => [f.x, f.x, f.x, f.x, '*']}
                rule={(f) => {
                    f.apply(f.field.Z, { Header: 'hello guys' })
                    f.apply(f.field.Y, { LabelText: null })
                    f.apply(f.field.Sub1.Z, { Header: 'hope you guys good' })
                    f.apply(f.field.Sub1, {
                        children: (f) => [f.X, f.Y, f.Y, '*'],
                        Header: 'hope you guys good',
                    })
                    // return { Body: 'hello' }
                }}
                global={({ field, apply, catalog }) => {
                    // apply(field, {
                    //     Shell: catalog.ShellMobile,
                    //     Indent: (f) => f.depth + '>>',
                    // })
                    if (isFieldNumber(field)) return { Header: <>🟢{<catalog.number.def field={field} />}</> }
                }}
            />
        </div>
    )
})
