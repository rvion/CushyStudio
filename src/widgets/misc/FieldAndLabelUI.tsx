import { observer } from 'mobx-react-lite'

export const FieldAndLabelUI = observer(function SubtlePanelConfUI_(p: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <div tw='text-base-content'>{p.label}</div>
            {p.children}
        </div>
    )
})

export const FieldAndLabelInlineUI = observer(function FieldAndLabelInlineUI_(p: { label: string; children: React.ReactNode }) {
    return (
        <div tw='flex gap-1'>
            <div
                style={{
                    flexShrink: 0,
                    minWidth: '8rem',
                    textAlign: 'right',

                    width: '25%',
                    marginRight: '0.25rem',
                }}
                tw='text-base-content'
            >
                {p.label}
            </div>
            {p.children}
        </div>
    )
})
