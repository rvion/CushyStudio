import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { ComfyCodeEditorUI } from './ComfyCodeEditorUI'
import { VersionPickerUI } from './VersionPickerUI'
import { MainActionsUI } from './MainActionsUI'
import { NodeListUI } from './NodeListUI'

import { EditorState, stContext, useSt } from './EditorState'
import { MenuPaneUI } from './MenuPane'

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
    return <div>st.por</div>
})
