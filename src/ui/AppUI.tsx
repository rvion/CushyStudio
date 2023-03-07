import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { ComfyCodeEditorUI } from './ComfyCodeEditorUI'
import { VersionPickerUI } from './VersionPickerUI'
import { MainActionsUI } from './MainActionsUI'
import { NodeListUI } from './NodeListUI'

import { EditorState, stContext, useSt } from './EditorState'
import { MenuPaneUI } from './MenuPane'
import { NodeRefUI } from './NodeRefUI'

export const AppUI = observer(function AppUI_() {
    const st = useMemo(() => new EditorState(), [Math.random()])
    return (
        <stContext.Provider value={st}>
            <div className='col'>
                <div className='appbar row items-center gap px'>
                    Menu
                    <div className='grow'></div>
                    <VersionPickerUI />
                </div>
                <div className='row'>
                    <div className='col menu gap'>
                        <MenuPaneUI title='actions'>
                            <MainActionsUI />
                        </MenuPaneUI>
                        <MenuPaneUI title='Artifacts'>
                            <ArtifactsUI />
                        </MenuPaneUI>
                    </div>
                    <ComfyCodeEditorUI />
                    <div className='menu'>
                        <MenuPaneUI title='Nodes'>
                            <NodeListUI />
                        </MenuPaneUI>
                    </div>
                </div>
                {/* <div>OK {st.file && st.file.getValue()}</div> */}
            </div>
        </stContext.Provider>
    )
})

export const ArtifactsUI = observer(function ArtifactsUI_(p: {}) {
    const st = useSt()
    return (
        <div>
            {st.project.outputs.map((o, ix) => {
                return (
                    <div key={ix}>
                        <h3>Step {ix}</h3>
                        <div className='row wrap'>
                            <NodeRefUI nodeUID={o.data.node} />
                            {o.data.output.images.map((url) => (
                                <div key={url}>
                                    <img
                                        style={{ width: '5rem', height: '5rem' }}
                                        key={url}
                                        src={`http://${st.project.serverHost}/view/${url}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
})
