import { observer } from 'mobx-react-lite'

import { FormUI } from '../../controls/FormUI'
import { useSt } from '../../state/stateContext'

/** This will allow devs to view re-usable forms once the form registering system is implemented */
export const PlaygroundRegisteredForms = observer(function PlaygroundRequirements_(p: {}) {
    const st = useSt()
    return (
        <div tw='h-full bg-base-300 p-1'>
            <div tw='p-1 rounded  border border-primary/30'>
                <div tw='w-full items-center text-center'>
                    <p>Currently Unused</p>
                </div>
                <div tw='w-full my-1 rounded bg-neutral-content' style={{ height: '1px', minHeight: '1px' }} />
                {/* TODO: Should get a registered form by id and display it. */}
                <FormUI form={st.favbar} />
            </div>
        </div>
    )
})
