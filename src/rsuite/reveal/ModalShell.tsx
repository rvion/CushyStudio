import { observer } from 'mobx-react-lite'

export const ModalShellUI = observer(function ModalShellUI_(p: {
    //
    title?: React.ReactNode
    className?: string
    children?: React.ReactNode
    footer?: React.ReactNode | undefined
    close: () => void
}) {
    return (
        <div
            className={p.className}
            tw={[
                //
                'animate-in fade-in',
                'virtualBorder p-4 rounded-xl bg-base-100 shadow-xl',
            ]}
            onClick={(ev) => ev.stopPropagation()}
        >
            {/* header */}
            <div tw='flex'>
                <div tw='text-xl'>{p.title}</div>
                <div tw='flex-1'></div>
                <div
                    tw='btn btn-sm btn-square'
                    onClick={(ev) => {
                        ev.stopPropagation()
                        ev.preventDefault()
                        p.close()
                    }}
                >
                    <span className='material-symbols-outlined'>close</span>
                </div>
            </div>
            <div className='divider my-0'></div>
            <div tw='_ModalBody'>{p.children}</div>
            <div tw='_ModalFooter'>{p.footer}</div>
        </div>
    )
})
