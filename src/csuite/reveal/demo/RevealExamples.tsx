import { observer } from 'mobx-react-lite'

import { RevealUI } from '../RevealUI'

export const RevealExample_NestedMenuUI = observer(function RevealExample_NestedMenuUI_(p: {}) {
    return (
        <div>
            <RevealUI
                trigger='hover'
                showDelay={0}
                children={<div tw='btn'>👋 menu</div>}
                content={() => (
                    <>
                        {[1, 2, 3].map((i) => (
                            <RevealUI
                                trigger='hover'
                                hideDelay={0}
                                showDelay={0}
                                placement='rightStart'
                                children={<div tw='btn'>👋 menu-{i}</div>}
                                content={() => (
                                    <>
                                        {[1, 2].map((j) => (
                                            <RevealUI
                                                trigger='hover'
                                                hideDelay={0}
                                                showDelay={0}
                                                placement='rightStart'
                                                children={
                                                    <div tw='btn'>
                                                        👋 menu-{i}-{j}
                                                    </div>
                                                }
                                                content={() => <div>goodbye</div>}
                                            />
                                        ))}
                                    </>
                                )}
                            />
                        ))}
                    </>
                )}
            />
        </div>
    )
})

export const RevealExample_InfiniteMenuUI = observer(function RevealExample_NestedMenuUI_(p: { prefix: string }) {
    return (
        <div>
            <RevealUI
                trigger='hover'
                placement='autoHorizontalStart'
                showDelay={0}
                children={<div tw='btn'>{p.prefix}</div>}
                content={() => (
                    <>
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <RevealExample_InfiniteMenuUI prefix={`${p.prefix}-${i}`} />
                        ))}
                    </>
                )}
            />
        </div>
    )
})
