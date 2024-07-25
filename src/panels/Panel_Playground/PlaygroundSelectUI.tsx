import { observer, useLocalObservable } from 'mobx-react-lite'

import { BadgeUI } from '../../csuite/badge/BadgeUI'
import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { Frame } from '../../csuite/frame/Frame'
import { RevealTestUI } from '../../csuite/reveal/demo/RevealTest'
import { SelectUI } from '../../csuite/select/SelectUI'

/** Freely modify this as you like, then pick the "Scratch Pad" option in the top left. Do not commit changes made to this. */
export const PlaygroundSelectUI = observer(function PlaygroundSelectUI_(p: {}) {
    const values = useLocalObservable(
        () => ({
            a: null as Maybe<string>,
            b: null as Maybe<string>,
            c: new Set<string>(),
            d: new Set<string>(),
        }),
        [],
    )

    return (
        <ErrorBoundaryUI>
            <div tw='flex flex-col gap-1'>
                <Frame line tw='m-1' /* SINGLE SELECT */>
                    <Frame expand base={{ chroma: 0.05, hue: 40 }}>
                        <SelectUI<string>
                            options={() => ['test', 'test2', 'test3']}
                            getLabelText={(v) => v}
                            value={() => values.a}
                            onOptionToggled={(opt) => (values.a = opt)}
                        />
                    </Frame>
                    <Frame expand base={{ chroma: 0.05, hue: 80 }}>
                        <SelectUI<string>
                            value={() => values.b}
                            options={() => [ 'test', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10', 'test11', 'test12', 'test13', 'test14', 'test15', 'test16', 'test17', 'test18', 'test19', 'test20', 'test21', 'test22', 'test23', 'test24', 'test25', 'test26', 'test27', 'test28', 'test29', ]} // prettier-ignore
                            onOptionToggled={(opt) => (values.b = opt)}
                            getLabelText={(v) => v}
                            getLabelUI={(v) => <BadgeUI autoHue>{v}</BadgeUI>}
                        />
                    </Frame>
                </Frame>
                <Frame line tw='m-1' /* MULTI SELECT */>
                    <Frame expand base={{ chroma: 0.05, hue: 40 }}>
                        <SelectUI<string>
                            multiple
                            options={() => ['test', 'test2', 'test3']}
                            getLabelText={(v) => v}
                            value={() => [...values.c]}
                            onOptionToggled={(v) => (values.c.has(v) ? values.c.delete(v) : values.c.add(v))}
                        />
                    </Frame>
                    <Frame expand base={{ chroma: 0.05, hue: 80 }}>
                        <SelectUI<string>
                            multiple
                            value={() => [...values.d]}
                            options={() => [ 'test', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10', 'test11', 'test12', 'test13', 'test14', 'test15', 'test16', 'test17', 'test18', 'test19', 'test20', 'test21', 'test22', 'test23', 'test24', 'test25', 'test26', 'test27', 'test28', 'test29', ]} // prettier-ignore
                            onOptionToggled={(v) => (values.d.has(v) ? values.d.delete(v) : values.d.add(v))}
                            getLabelText={(v) => v}
                            getLabelUI={(v) => <BadgeUI autoHue>{v}</BadgeUI>}
                        />
                    </Frame>
                </Frame>

                {cushy.forms /* select via fields */
                    .fields((ui) => ({
                        test2: ui.selectMany({
                            appearance: 'select',
                            choices: [
                                { label: 'a', id: 'a' },
                                { label: 'b', id: 'b' },
                                { label: 'c', id: 'c' },
                                { label: 'ddddddd', id: 'ddddddd' },
                                { label: 'eeeeeee', id: 'eeeeeee' },
                                { label: 'ffffffff', id: 'ffffffff' },
                                { label: 'gggggggg', id: 'gggggggg' },
                                { label: 'hhhhhhhh', id: 'hhhhhh' },
                            ],
                        }),
                        test: ui.selectMany({
                            // showPickedListInBody: true,
                            choices: [
                                { label: 'a', id: 'a' },
                                { label: 'b', id: 'b' },
                                { label: 'c', id: 'c' },
                                { label: 'ddddddd', id: 'ddddddd' },
                                { label: 'eeeeeee', id: 'eeeeeee' },
                                { label: 'ffffffff', id: 'ffffffff' },
                                { label: 'gggggggg', id: 'gggggggg' },
                                { label: 'hhhhhhhh', id: 'hhhhhh' },
                            ],
                        }),
                    }))
                    .body()}
                <RevealTestUI />
            </div>
        </ErrorBoundaryUI>
    )
})
