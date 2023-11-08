import { observer } from 'mobx-react-lite'

export const SubtlePanelConfUI = observer(function SubtlePanelConfUI_(p: {
    //
    label: string
    children: React.ReactNode
}) {
    return (
        <div tw='py-2 opacity-50 hover:opacity-100'>
            {p.label}
            {p.children}
        </div>
    )
})
