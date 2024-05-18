import { useEffect } from 'react'

import { RevealExample_InfiniteMenuUI, RevealExample_NestedMenuUI } from '../rsuite/reveal/RevealExamples'
import { RevealUI } from '../rsuite/reveal/RevealUI'
import { activityManger } from './Activity'
import { menu_imageActions } from './commands/cmd_copyImage'

export const useDemoActivity = () =>
    useEffect(() => {
        activityManger.startActivity(DEMO_ACTIVITY)
    }, [])

export const DEMO_ACTIVITY = {
    uid: 'debug',
    UI: () => {
        const img = cushy.db.media_image.lastOrCrash()
        return (
            <div tw='flex items-center justify-center h-full bg-base-300' onClick={(ev) => ev.stopPropagation()}>
                <div tw='grid grid-cols-4 grid-visible'>
                    {/* A */}
                    <div>
                        <h3 tw='italic text-gray-500'>Open as as standalone Activity</h3>
                        <div tw='btn btn-primary' onClick={() => menu_imageActions.open(img)}>
                            Open
                        </div>
                    </div>

                    {/* B */}
                    <div>
                        <h3 tw='italic text-gray-500'>menu mounted as widget</h3>
                        <menu_imageActions.UI props={img} />
                    </div>

                    {/* C.1 */}
                    <RevealExample_NestedMenuUI />

                    {/* C.2 */}
                    <RevealExample_InfiniteMenuUI prefix='infinite' />

                    {/* D */}
                    <div>
                        <h3 tw='italic text-gray-500'>Open as as standalone Activity</h3>
                        <RevealUI placement='bottomStart' content={() => <menu_imageActions.UI props={img} />}>
                            <div tw='btn btn-primary' /* onClick={() => menu_imageActions.open(img)} */>Open</div>
                        </RevealUI>
                    </div>

                    {/* Es */}
                    <div>
                        <h3 tw='italic text-gray-500'>Open as as standalone Activity</h3>
                        <RevealUI placement='bottomStart' content={() => <menu_imageActions.UI props={img} />}>
                            <div tw='btn btn-primary' /* onClick={() => menu_imageActions.open(img)} */>Open</div>
                        </RevealUI>
                    </div>
                </div>
            </div>
        )
    },
}
