import { observer } from 'mobx-react-lite'
import { Message } from 'src/rsuite/shims'
import { useSt } from 'src/state/stateContext'
import { MainNavEntryUI } from '../app/layout/MainNavEntryUI'
import { ComboUI } from '../app/shortcuts/ComboUI'
import { DraftUI } from './Panel_Draft'

export const Panel_CurrentDraft = observer(function CurrentDraftUI_(p: {}) {
    const st = useSt()
    const draft = st._currentDraft

    // just in case no card is selected, open one
    // useEffect(() => {
    //     if (draft?.cardPath == null) st.openCardPicker()
    // }, [])

    if (draft == null) {
        return (
            <MainNavEntryUI
                tw='m-2'
                appearance='primary'
                onClick={() => st.toggleCardPicker()}
                icon={<span className='material-symbols-outlined'>play_circle</span>}
                label='Open Card Picker'
                tooltip={
                    <>
                        Open the card picker
                        <ComboUI combo='meta+1' />
                    </>
                }
            />
        )
    }
    const card = draft.app
    if (card == null)
        return (
            <Message type='error' showIcon>
                card not found
            </Message>
        )
    // if (draft?.draftID == null) return <ActionDraftListUI card={card} />
    return <DraftUI draft={draft} />
})
