import { observer } from 'mobx-react-lite'
import { Button } from 'rsuite'
import { DraftL } from 'src/models/Draft'
import { renderToolUI } from '../../../models/renderDraftUI'
import { TabUI } from '../layout/TabUI'
import { ScrollablePaneUI } from '../scrollableArea'
import { draftContext } from '../useDraft'
import { JSONHighlightedCodeUI, TypescriptHighlightedCodeUI } from '../utils/TypescriptHighlightedCodeUI'
import { openInVSCode } from 'src/utils/openInVsCode'
import { cwd } from 'process'
import { PossibleActionFile } from 'src/back/PossibleActionFile'

/**
 * this is the root interraction widget
 * if a workflow need user-supplied infos, it will send an 'ask' request with a list
 * of things it needs to know.
 */
export const ActionFormUI = observer(function ActionFormUI_(p: {
    //
    paf: PossibleActionFile
    draft: DraftL
}) {
    const draft = p.draft
    const tool = draft.tool.item
    const formDefinition = tool?.data.form ?? {}
    return (
        <draftContext.Provider value={draft} key={draft.id}>
            <div
                //
                className='m-4 fade-in flex flex-col flex-grow'
            >
                <div tw='row items-center font-bold font justify-between'>
                    <div tw='row items-center gap-2' style={{ fontSize: '1.7rem' }}>
                        <span>{tool.name}</span>
                        <Button
                            size='xs'
                            color='blue'
                            appearance='ghost'
                            startIcon={<span className='material-symbols-outlined'>edit</span>}
                            onClick={() => openInVSCode(cwd(), p.paf.absPath)}
                        >
                            Edit
                        </Button>
                    </div>
                    <Button
                        size='sm'
                        className='self-start'
                        color='green'
                        // disabled={!tool.st.ws.isOpen}
                        appearance='primary'
                        startIcon={<span className='material-symbols-outlined'>play_arrow</span>}
                        onClick={() => draft.start()}
                    >
                        Run
                    </Button>
                </div>
                <ScrollablePaneUI className='flex-grow '>
                    <div>{tool.data.description}</div>
                    <form
                        className='p-2 mt-4'
                        style={{
                            border: '1px dashed #565656',
                            background: '#1e1e1e',
                            borderRadius: '0.5rem',
                            boxShadow: '0 0 2rem #193558',
                        }}
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
                    <TabUI title='Debug:' tw='mt-auto'>
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
                </ScrollablePaneUI>
            </div>
        </draftContext.Provider>
    )
})
