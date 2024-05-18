import { observer } from 'mobx-react-lite'
import { Fragment } from 'react/jsx-runtime'

import { activityManger } from './Activity'
import { InputBlockerUI } from './InputBlocker'

export const ActivityUI = observer(function ActivityUI_(p: {}) {
    // useDemoActivity()
    return (
        <Fragment>
            {activityManger._stack.map((activity, ix) => (
                <InputBlockerUI
                    stop={() => {
                        activity.onStop?.()
                        activityManger.stopCurrentActivity()
                    }}
                    key={activity.uid}
                    ix={ix}
                >
                    <activity.UI activity={activity} stop={() => activityManger.stopActivity(activity)} />
                </InputBlockerUI>
            ))}
        </Fragment>
    )
})
