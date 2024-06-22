import type { RevealPlacement } from '../../csuite/reveal/RevealPlacement'
import type { Routine } from './Routine'
import type { FC, KeyboardEvent, MouseEvent, UIEvent } from 'react'

import { Trigger } from '../trigger/Trigger'

export type DomId = string

/**
 * Activities are <....TODO>
 *
 * You can construct activities without using classes
 * by providing any object that have some of those fields
 * but you may prefer to create activities
 * by extending the `SimpleActivity` class in case you want
 * a bit more utilies packed in, like state management
 */
export type Activity = {
    /** human-readable activity title */
    title?: Maybe<string>

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
    onEvent?: (event: UIEvent) => Trigger | null

    /**
     * then if not cancelled, and if defined, will be passed
     * to the those
     */
    onAuxClick?: (event: MouseEvent) => void
    onClick?: (event: MouseEvent) => void
    onMouseDown?: (event: MouseEvent) => void
    onMouseEnter?: (event: MouseEvent) => void
    onMouseLeave?: (event: MouseEvent) => void
    onKeyUp?: (event: KeyboardEvent) => void

    /**
     * @since 2024-05-21
     * @default null
     * how shells are wrapped
     */
    shell?: Maybe<'popup-lg' | 'popup-sm' | 'popup-full'>

    /**
     * activity UI overlay
     * you can leave that empty if you only care about processign events
     * */
    UI?: FC<{
        activity: Activity
        routine: Routine
        /** call that function to stop the activity */
        stop: () => void
    }>

    /**
     * @since 2024-05-21
     * mouse event this activity was started from
     * if specified, allow the activity to position itself relative to the mouse if need be
     */
    event?: MouseEvent

    /**
     * @since 2024-05-21
     * use placement position the activity container origin
     */
    placement?: RevealPlacement
}
