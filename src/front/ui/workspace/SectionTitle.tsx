import { observer } from 'mobx-react-lite'

export const SectionTitleUI = observer(function SectionTitleUI_(p: { className?: string; label: string }) {
    return <b className={`text-lg ${p.className} text-center`}>{p.label}</b>
})
