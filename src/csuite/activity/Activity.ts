import type { RevealPlacement } from '../../csuite/reveal/RevealPlacement'
import type { FC } from 'react'

import { Trigger } from '../trigger/Trigger'

export type DomId = string

export interface Activity {
    /** human-readable activity title */
    title?: string

    /** uniquer activity uid */
    uid: string

    /** if specified, the activity is bound the the given ID */
    bound?: DomId | null

    /** will be executed when activity start */
    onStart?: () => void

    /** will be executed when activity end */
    onStop?: () => void

    /**
     * everytime an event bubbles upward to the activity root, it will
     * pass through this function
     */
    onEvent?: (event: Event) => Trigger | null

    /**
     * @since 2024-05-21
     * @default null
     * how shells are wrapped
     */
    shell?: Maybe<'popup-lg' | 'popup-sm' | 'popup-full'>

    /** activity UI */
    UI: FC<{
        activity: Activity
        /** call that function to stop the activity */
        stop: () => void
    }>

    /**
     * @since 2024-05-21
     * mouse event this activity was started from
     * if specified, allow the activity to position itself relative to the mouse if need be
     */
    event?: React.MouseEvent<HTMLElement, MouseEvent>

    /**
     * @since 2024-05-21
     * use placement position the activity container origin
     */
    placement?: RevealPlacement
}
