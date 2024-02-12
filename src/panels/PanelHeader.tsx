import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'

export const PanelHeaderUI = observer(function PanelHeaderUI_(p: {
    /** @default "Options" */
    label?: string
    children: React.ReactNode
}) {
    return (
        <div className='cushy-panel-header'>
            <RevealUI tooltipWrapperClassName='p-2'>
                <div tw='btn btn-sm'>
                    <span className='material-symbols-outlined'>settings</span>
                    {p.label ?? 'Options'}
                </div>
                <div tw='min-w-96'>{p.children}</div>
            </RevealUI>
        </div>
    )
})

export const PanelHeaderSmallUI = observer(function PanelHeaderSmallUI_(p: { children: React.ReactNode }) {
    return (
        <div className='cushy-panel-header'>
            <RevealUI tw='w-full'>
                <div tw='btn btn-sm w-full'>
                    <span className='material-symbols-outlined'>settings</span>
                </div>
                <div tw='min-w-96'>{p.children}</div>
            </RevealUI>
        </div>
    )
})
