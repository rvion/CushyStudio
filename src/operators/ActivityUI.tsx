import { observer } from 'mobx-react-lite'
import { Fragment } from 'react/jsx-runtime'

import { activityManger } from './Activity'
import { InputBlockerUI } from './InputBlocker'

export const ActivityUI = observer(function ActivityUI_(p: {}) {
    // useDebugActivity()
    return (
        <Fragment>
            {activityManger.stack.map((activity, ix) => (
                <InputBlockerUI
                    stop={() => {
                        activity.onStop?.()
                        activityManger.pop()
                    }}
                    key={activity.uid}
                    ix={ix}
                >
                    <activity.UI />
                </InputBlockerUI>
            ))}
        </Fragment>
    )
})
