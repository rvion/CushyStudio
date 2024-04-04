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
                            <div tw='btn' onClick={() => menu_imageActions.open(img)}>
                                open
                            </div>
                            <menu_imageActions.UI props={img} />
                            <RevealExample_NestedMenuUI />
                        </div>
                    </div>
                )
            },
        })
    }, [])
