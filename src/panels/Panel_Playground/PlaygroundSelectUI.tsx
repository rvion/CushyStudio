import { observer } from 'mobx-react-lite'

import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'

/** Freely modify this as you like, then pick the "Scratch Pad" option in the top left. Do not commit changes made to this. */
export const PlaygroundSelectUI = observer(function PlaygroundSelectUI_(p: {}) {
    return (
        <ErrorBoundaryUI>
            <div tw='flex flex-col gap-1'>
                {cushy.forms
                    .fields((ui) => ({
                        test2: ui.selectMany({
                            // showPickedListInBody: true,
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
                    .render()}
                {/*  */}
                {/*  */}
            </div>
        </ErrorBoundaryUI>
    )
})
