import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'

export const PanelHeaderUI = observer(function PanelHeaderUI_(p: { children: React.ReactNode }) {
    return (
        <div className='cushy-panel-header'>
            <RevealUI tooltipWrapperClassName='p-2'>
                <div tw='btn btn-sm'>
                    <span className='material-symbols-outlined'>settings</span>
                    Options
                </div>
                {p.children}
            </RevealUI>
        </div>
    )
})
