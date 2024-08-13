import { observer } from 'mobx-react-lite'
import { Fragment } from 'react/jsx-runtime'

import { ActivityContainerUI } from './ActivityContainerUI'
import { activityManager } from './ActivityManager'

export const ActivityStackUI = observer(function ActivityStackUI_(p: {}) {
    return (
        <Fragment>
            {activityManager.routines.map((routine, ix) => {
                const activity = routine.activity
                return (
                    <ActivityContainerUI
                        stop={() => {
                            activity.onStop?.()
                            activityManager.stopLast()
                        }}
                        key={routine.uid}
                        routine={routine}
                        ix={ix}
                    >
                        {/*
                        some activities do not have any UI associated;
                        we STILL want to use the ActivityContainerUI
                        to handle the event.
                    */}
                        {activity.UI ? (
                            <activity.UI //
                                routine={routine}
                                activity={activity}
                                stop={() => activityManager.stop(routine)}
                            />
                        ) : null}
                    </ActivityContainerUI>
                )
            })}
        </Fragment>
    )
})
