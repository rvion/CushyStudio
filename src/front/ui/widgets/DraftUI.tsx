import { observer } from 'mobx-react-lite'
import { Button, Input, Panel } from 'rsuite'
import { DraftL } from 'src/models/Draft'
import { JSONHighlightedCodeUI, TypescriptHighlightedCodeUI } from '../TypescriptHighlightedCodeUI'
import { TabUI } from '../layout/TabUI'
import { ScrollablePaneUI } from '../scrollableArea'
import { draftContext } from '../useDraft'
import { WidgetWithLabelUI } from './WidgetUI'
import { renderToolUI } from '../../../models/renderDraftUI'

/**
 * this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const DraftUI = observer(function DraftUI_(p: { draft: DraftL }) {
    const draft = p.draft
    const tool = draft.tool.item
    const formDefinition = tool?.data.form ?? {}
    return (
        <draftContext.Provider value={draft} key={draft.id}>
            <div>
                <div className='flex p-2'>
                    <Input
                        onChange={(v) => draft.update({ title: v })}
                        size='sm'
                        placeholder='preset title'
                        value={draft.data.title ?? ''}
                    />
                    <Button
                        size='sm'
                        className='self-start'
                        color='green'
                        appearance='primary'
                        startIcon={<span className='material-symbols-outlined'>play_arrow</span>}
                        onClick={() => draft.start()}
                    >
                        Run
                    </Button>
                </div>
            </div>
            <ScrollablePaneUI className='flex-grow'>
                <div className='px-2'>
                    <form
                        onKeyUp={(ev) => {
                            // submit on meta+enter
                            if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) {
                                console.log('SUBMIT')
                                ev.preventDefault()
                                ev.stopPropagation()
                                draft.start()
                            }
                        }}
                        onSubmit={(ev) => {
                            console.log('SUBMIT')
                            ev.preventDefault()
                            ev.stopPropagation()
                            draft.start()
                        }}
                    >
                        {/* ROOT */}
                        {renderToolUI(draft, tool)}
                        {/* {Object.entries(formDefinition).map(([rootKey, req], ix) => {
                            return (
                                <WidgetWithLabelUI
                                    path={[rootKey]}
                                    key={rootKey}
                                    rootKey={rootKey}
                                    req={req}
                                    ix={ix}
                                    draft={draft}
                                />
                            )
                        })} */}
                    </form>
                    <TabUI title='Debug:'>
                        <div>no</div>
                        <div></div>
                        <div>result</div>
                        <JSONHighlightedCodeUI code={JSON.stringify(draft.finalJSON, null, 4)} />
                        <div>form</div>
                        <JSONHighlightedCodeUI code={JSON.stringify(formDefinition, null, 4)} />
                        <div>state</div>
                        <JSONHighlightedCodeUI code={JSON.stringify(draft.data.params, null, 4)} />
                        <div>ts</div>
                        <TypescriptHighlightedCodeUI code={tool.data.codeTS ?? ''} />
                        <div>js</div>
                        <TypescriptHighlightedCodeUI code={tool.data.codeJS ?? ''} />
                    </TabUI>
                </div>
            </ScrollablePaneUI>
        </draftContext.Provider>
    )
})
