import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect } from 'react'
// import { Message } from 'src/rsuite/shims'
// import { useSt } from 'src/state/stateContext'
// import { MainNavEntryUI } from '../app/layout/MainNavEntryUI'
// import { ComboUI } from '../app/shortcuts/ComboUI'
// import { DraftUI } from './Panel_Draft'

export const Panel_CurrentDraft = observer(function CurrentDraftUI_(p: {}) {
    useEffect(() => {
        // confetti
        void (async () => {
            const confetti = (await import('https://cdn.skypack.dev/canvas-confetti' as any)).default
            confetti()
        })()
    })
    return (
        <div tw='relative'>
            <section tw='text-center py-2'>
                <h1 tw='text-xl'>Welcome to CushyStudio !</h1>
            </section>
        </div>
    )
    // const st = useSt()
    // const draft = st.currentDraft
    // // just in case no card is selected, open one
    // // useEffect(() => {
    // //     if (draft?.cardPath == null) st.openCardPicker()
    // // }, [])

    // if (draft == null) {
    //     return (
    //         <MainNavEntryUI
    //             tw='m-2'
    //             onClick={() => st.toggleFullLibrary()}
    //             icon={<span className='material-symbols-outlined'>play_circle</span>}
    //             label='Open Card Picker'
    //         >
    //             Open the App Library
    //             <ComboUI combo='meta+1' />
    //         </MainNavEntryUI>
    //     )
    // }
    // const card = draft.file
    // if (card == null)
    //     return (
    //         <Message type='error' showIcon>
    //             app "{draft.data.appID}" not found
    //         </Message>
    //     )
    // // if (draft?.draftID == null) return <ActionDraftListUI card={card} />
    // return <DraftUI draft={draft} />
})
