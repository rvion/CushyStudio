import { observer } from 'mobx-react-lite'

export const SectionTitleUI = observer(function SectionTitleUI_(p: {
    children?: React.ReactNode
    className?: string
    label: React.ReactNode
}) {
    return (
        <b className={`flex ${p.className}`}>
            <div className='flex-grow mt-auto mb-auto'>{p.label}</div>
            {p.children}
        </b>
    )
})
