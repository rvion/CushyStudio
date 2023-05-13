import { observer } from 'mobx-react-lite'
import { Fragment } from 'react'
import { useSt } from '../../front/stContext'
import { FlowGeneratedImagesUI } from '../FlowGeneratedImagesUI'
import { renderMsgUI } from './flowRenderer1'
import { ActionPickerUI } from '../WorkflowPickerUI'

export const FlowLogUI = observer(function FlowLogUI_(p: {}) {
    const st = useSt()
    return (
        <div className='flex flex-col gap-2 p-2'>
            <ActionPickerUI />
            {st.groupItemsToShow.map((group, groupIx) => {
                // if (group.le)
                return (
                    <div key={groupIx} className='relative [width:100%]' style={{ overflowX: 'auto' }}>
                        {/* <div>
                            {group.groupType} {group.messages.length}
                        </div> */}
                        <div style={{ flexWrap: group.wrap ? 'wrap' : undefined }} className='flex row gap-2'>
                            {group.uis}
                        </div>
                    </div>
                )
            })}
        </div>
    )
})
