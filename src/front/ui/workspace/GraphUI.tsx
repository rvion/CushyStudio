import { observer, useLocalObservable } from 'mobx-react-lite'

import { Pane } from 'split-pane-react'
import SplitPane from 'split-pane-react/esm/SplitPane'
import { ActionPickerUI } from './ActionPickerUI'
import { DraftPaneUI } from './DraftPaneUI'
import { SectionTitleUI } from './SectionTitle'
import { StepListUI } from './StepUI'

export const GraphUI = observer(function GraphUI_(p: { depth: number }) {
    const uiSt = useLocalObservable(() => ({ sizes: [100, 300, 150] }))

    return (
        <SplitPane
            performanceMode
            sashRender={() => <div className='bg-gray-200'></div>}
            onChange={(ev) => (uiSt.sizes = ev)}
            sizes={uiSt.sizes}
            split='vertical'
            style={{ height: '100%' }}
        >
            {/* 1. ACTION */}
            <Pane minSize='150px' className='col' style={{ overflow: 'auto', background: '120202' }}>
                <ActionPickerUI />
            </Pane>

            {/* 2. DRAFTS  */}
            <Pane minSize='100px' className='col' style={{ background: '#0c0c0c' }}>
                <SectionTitleUI label='DRAFTS' className='bg-green-950' />
                <DraftPaneUI />
            </Pane>

            {/* 3. STEPS */}
            <Pane minSize='100px' className='col'>
                <SectionTitleUI label='RUNS' className='bg-yellow-900' />
                <StepListUI />
            </Pane>
        </SplitPane>
    )
})
