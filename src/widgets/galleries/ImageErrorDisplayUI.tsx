import { observer } from 'mobx-react-lite'

export const ImageErrorDisplayUI = observer(function ImageErrorDisplayUI_(p: {
    className?: string
    icon: string
    size?: string
}) {
    return (
        <div
            className={p.className}
            tw='border-error bg-error/5 text-error pointer-events-none relative flex h-full w-full select-none flex-col items-center justify-center rounded border border-dotted'
        >
            <div tw='relative flex text-sm' style={{ fontSize: p.size ?? 'inherit' }}>
                <span className='material-symbols-outlined'>scan_delete</span>
            </div>
            <div tw='absolute right-0 top-0 -translate-x-0.5 translate-y-0.5' style={{ fontSize: '0px' }}>
                {p.icon && (
                    <span className='material-symbols-outlined' style={{ fontSize: '12px' }}>
                        {p.icon}
                    </span>
                )}
            </div>
        </div>
    )
})
