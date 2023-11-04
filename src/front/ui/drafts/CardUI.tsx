import type { CardPath } from 'src/cards/CardPath'

import { observer } from 'mobx-react-lite'
import { cwd } from 'process'
import { useEffect } from 'react'
import { Button, Message } from 'rsuite'
import { useSt } from 'src/front/FrontStateCtx'
import { openInVSCode } from 'src/utils/openInVsCode'
import { ActionDraftListUI } from './ActionDraftListUI'
import { DraftUI } from './DraftUI'

export const CardUI = observer(function ActionFileUI_(p: { actionPath: CardPath }) {
    const st = useSt()
    const toolbox = st.library
    const card = toolbox.getCard(p.actionPath)

    useEffect(() => {
        void card?.load()
    }, [card])

    if (card == null)
        return (
            <Message type='error'>
                <pre tw='bg-red-900'>A. ❌ action file {JSON.stringify(p.actionPath)} not found</pre>
            </Message>
        )

    const defaultDraft = card?.drafts[0]
    const errors =
        card.errors.length > 0 ? ( //
            <Message type='warning'>{JSON.stringify(card.errors, null, 4)}</Message>
        ) : null

    if (defaultDraft == null)
        return (
            <>
                <div tw='row items-center gap-2' style={{ fontSize: '1.7rem' }}>
                    {/* TITLE */}
                    <span>{card.name}</span>
                    {/* EDIT */}
                    <Button
                        size='xs'
                        color='blue'
                        appearance='ghost'
                        startIcon={<span className='material-symbols-outlined'>edit</span>}
                        onClick={() => openInVSCode(cwd(), card.absPath)}
                    >
                        Edit
                    </Button>
                </div>
                {/* {st.liveTime} */}
                {card.action == null ? (
                    <Message type='error' showIcon>
                        <pre tw='bg-red-900'>B. ❌ action not found</pre>
                        <pre>loadRequested: {card.loadRequested ? '🟢' : '❌'}</pre>
                        <pre tw='bg-red-900'>{JSON.stringify(card.errors)}</pre>
                    </Message>
                ) : null}
                {errors}
                {/* DRAFT LIST */}
                <ActionDraftListUI card={card} />
            </>
        )

    return <DraftUI draft={defaultDraft} />
})
