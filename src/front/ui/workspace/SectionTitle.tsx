import { observer } from 'mobx-react-lite'

export const SectionTitleUI = observer(function SectionTitleUI_(p: { className?: string; label: string }) {
    return (
        <b
            style={{
                borderTopLeftRadius: '5rem',
                borderTopRightRadius: '5rem',
            }}
            // className={`text-lg bg-gray-800 text-center`}
            className={`text-ms ${p.className} text-center`}
        >
            {p.label}
        </b>
    )
})
