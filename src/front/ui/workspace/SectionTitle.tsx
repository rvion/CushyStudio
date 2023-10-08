import { observer } from 'mobx-react-lite'

export const SectionTitleUI = observer(function SectionTitleUI_(p: {
    children?: React.ReactNode
    className?: string
    label: string
}) {
    return (
        <b className={`flex item-center ${p.className} text-center h-8`}>
            <div className='flex-grow mt-auto mb-auto'>{p.label}</div>
            {p.children}
        </b>
    )
})
