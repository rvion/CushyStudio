import type { FC } from 'react'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'

export const PlaygroundSkinsUI = observer(function PlaygroundSkinsUI_(p: {}) {
    const xx = cushy.forms.useLocalstorage('SCm5xmdc', (ui) =>
        ui.fields({
            a: ui.string(),
            b: ui.string(),
            arr: ui
                .fields({
                    x: ui.int(),
                    y: ui.int(),
                })
                .list({ min: 3 }),
        }),
    )
    return (
        <Frame row expand tw='gap-2'>
            <Frame row expand tw='gap-2'>
                <Frame expand col tw='gap-2'>
                    <Frame border base expand>
                        default (full)
                        {xx.render()}
                    </Frame>
                </Frame>
                <Frame border base expand>
                    {xx.show(({ fields: f }) => [`# hello\n\nI love the 'a' field`, f.a, f.a, f.a])}
                    {xx.show((f) => ['a', 'b', 'b', 'b'])}
                </Frame>
                <Frame border base expand>
                    {xx.show(['a', 'b', (f): Maybe<FC<any>> => f.Arr.at(1)?.customForm(['x', 'x'])])}
                </Frame>
            </Frame>
        </Frame>
    )
})
