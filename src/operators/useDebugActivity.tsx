import { useEffect } from 'react'

import { RevealExample_NestedMenuUI } from '../rsuite/reveal/RevealExamples'
import { activityManger } from './Activity'
import { menu_imageActions } from './examples'

export const useDebugActivity = () =>
    useEffect(() => {
        activityManger.push({
            uid: 'debug',
            UI: () => {
                const img = cushy.db.media_image.lastOrCrash()
                return (
                    <div tw='flex items-center justify-center h-full bg-neutral' onClick={(ev) => ev.stopPropagation()}>
                        <div tw='grid grid-cols-3 grid-visible'>
                            {/*  */}
                            <div>
                                <h3 tw='italic text-gray-500'>Open as as standalone Activity</h3>
                                <div tw='btn btn-primary' onClick={() => menu_imageActions.open(img)}>
                                    Open
                                </div>
                            </div>

                            <div>
                                <h3 tw='italic text-gray-500'>menu mounted as widget</h3>
                                <menu_imageActions.UI props={img} />
                            </div>
                            <RevealExample_NestedMenuUI />
                        </div>
                    </div>
                )
            },
        })
    }, [])
