import { observer } from 'mobx-react-lite'

export const ImageErrorDisplayUI = observer(function ImageErrorDisplayUI_(p: {
    className?: string
    icon: string
    size?: string
}) {
    return (
        <div
            className={p.className}
            tw='relative rounded flex flex-col w-full h-full border border-error border-dotted items-center justify-center bg-error/5 text-error select-none pointer-events-none'
        >
            <div tw='flex relative text-sm' style={{ fontSize: p.size ?? 'inherit' }}>
                <span className='material-symbols-outlined'>scan_delete</span>
            </div>
            <div tw='absolute top-0 right-0 -translate-x-0.5 translate-y-0.5' style={{ fontSize: '0px' }}>
                {p.icon && (
                    <span className='material-symbols-outlined' style={{ fontSize: '12px' }}>
                        {p.icon}
                    </span>
                )}
            </div>
        </div>
    )
})
