import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x))

let isDragging = false
let wasEnabled = false

export const InputBoolUI = observer(function InputBoolUI_(p: {
    active?: Maybe<boolean>
    display?: 'check' | 'button'
    expand?: boolean
    icon?: string
    text?: string
    className?: string
    onValueChange?: (next: boolean) => void
}) {
    const isActive = p.active ?? false
    const display = p.display ?? 'check'
    const expand = p.expand
    const icon = p.icon
    const label = p.text

    const isDraggingListener = (ev: MouseEvent) => {
        if (ev.button == 0) {
            isDragging = false
            window.removeEventListener('mouseup', isDraggingListener, true)
        }
    }

    return (
        <div // Container
            className={p.className}
            tw={[
                'WIDGET-FIELD select-none',
                'flex items-center',
                '!outline-none',
                'hover:brightness-110',
                isActive && 'brightness-110',
                // Make the click-able area take up the entire width when as a checkmark and haven't explicitly set expand to false.
                ((display == 'check' && expand === undefined) || expand) && 'w-full',
            ]}
            tabIndex={-1}
            onMouseDown={(ev) => {
                if (ev.button == 0) {
                    wasEnabled = !isActive
                    isDragging = true
                    ev.stopPropagation()
                    window.addEventListener('mouseup', isDraggingListener, true)
                    if (!p.onValueChange) return
                    p.onValueChange(!isActive)
                }
            }}
            onMouseEnter={(ev) => {
                if (!isDragging) return
                if (!p.onValueChange) return
                p.onValueChange(wasEnabled)
            }}
        >
            {display == 'check' ? (
                <>
                    <div
                        tw={[
                            //
                            'flex items-center rounded-sm bg-base-100',
                            'border border-base-200',
                            'border-b-2 border-b-base-300 box-content',
                        ]}
                    >
                        <input
                            type='checkbox'
                            checked={isActive}
                            tw={['checkbox checkbox-primary h-5 w-5 rounded-sm !outline-none cursor-default']}
                            tabIndex={-1}
                            readOnly
                        />
                    </div>
                    {icon && (
                        <span tw='pl-1.5' className='material-symbols-outlined'>
                            {icon}
                        </span>
                    )}
                    {label && <div tw={[icon ? 'pl-1' : 'pl-1.5']}>{label}</div>}
                </>
            ) : (
                <>
                    <div
                        tw={[
                            //
                            'flex items-center h-full p-1 px-2 rounded',
                            'bg-base-200 border border-base-100 text-shadow',
                            'border-b-2 border-b-base-300',
                            isActive && 'bg-primary text-primary-content text-shadow-inv',
                            icon && 'pl-1.5',
                            expand && 'w-full justify-center',
                        ]}
                    >
                        {icon && (
                            <span tw='flex-shrink-0 h-full pr-1.5 shadow-inherit' className='material-symbols-outlined'>
                                {icon}
                            </span>
                        )}
                        <p tw='w-full text-center line-clamp-1'>{label ? label : <></>}</p>
                    </div>
                </>
            )}
        </div>
    )
})
