import * as I from '@rsuite/icons'
import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { ActionL } from 'src/models/Action'
import { useSt } from '../../FrontStateCtx'

export const ActionPickerUI = observer(function ActionPickerUI_(p: { action: ActionL }) {
    const st = useSt()
    const action = p.action
    const currentToolID = action.tool.id
    return (
        <div className='flex flex-col'>
            {/* <ButtonGroup className='flex flex-col'> */}
            {/* ({uiSt.currentActionID}) */}
            {st.actionsSorted.slice(0, 3 /* 🔴 */).map((a) => {
                return (
                    <Button
                        startIcon={<I.PlayOutline />}
                        key={a.id}
                        size='sm'
                        appearance='link'
                        // appearance={currentToolID === a.id ? 'primary' : 'ghost'}
                        color={currentToolID === a.id ? 'green' : undefined}
                        onClick={() => action.update({ toolID: a.id })}
                    >
                        <div>{a.data.name}</div>
                    </Button>
                )
            })}
        </div>
    )
})
