import { observer } from 'mobx-react-lite'

import { Button } from '../rsuite/button/Button'
import { Frame } from '../rsuite/frame/Frame'
import { RevealExample_InfiniteMenuUI, RevealExample_NestedMenuUI } from '../rsuite/reveal/RevealExamples'
import { RevealUI } from '../rsuite/reveal/RevealUI'
import { menu_imageActions } from './commands/cmd_copyImage'

export const DemoActivityUI = observer(() => {
    const img = cushy.db.media_image.lastOrCrash()
    return (
        <Frame tw='flex items-center justify-center h-full' onClick={(ev) => ev.stopPropagation()}>
            <div tw='grid grid-cols-4 grid-visible gap-2'>
                {/* A */}
                <Frame>
                    <h3 tw='italic text-gray-500'>Open as as standalone Activity</h3>
                    <Button look='primary' onClick={() => menu_imageActions.open(img)}>
                        Open
                    </Button>
                </Frame>

                {/* B */}
                <Frame>
                    <h3 tw='italic text-gray-500'>menu mounted as widget</h3>
                    <menu_imageActions.UI props={img} />
                </Frame>

                {/* C.1 */}
                <RevealExample_NestedMenuUI />

                {/* C.2 */}
                <RevealExample_InfiniteMenuUI prefix='infinite' />

                {/* D */}
                <Frame>
                    <h3 tw='italic text-gray-500'>Open as as standalone Activity</h3>
                    <RevealUI placement='bottomStart' content={() => <menu_imageActions.UI props={img} />}>
                        <Button look='primary'>Open</Button>
                    </RevealUI>
                </Frame>

                {/* Es */}
                <Frame>
                    <h3 tw='italic text-gray-500'>Open as as standalone Activity</h3>
                    <RevealUI placement='bottomStart' content={() => <menu_imageActions.UI props={img} />}>
                        <Button look='primary' /* onClick={() => menu_imageActions.open(img)} */>Open</Button>
                    </RevealUI>
                </Frame>
            </div>
        </Frame>
    )
})
