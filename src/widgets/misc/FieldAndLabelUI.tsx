import { observer } from 'mobx-react-lite'

export const FieldAndLabelUI = observer(function SubtlePanelConfUI_(p: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <div tw='text-base-content'>{p.label}</div>
            {p.children}
        </div>
    )
})
