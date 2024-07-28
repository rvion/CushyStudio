import type { RSSize } from '../types/RsuiteTypes'

import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { exhaust } from '../utils/exhaust'

export const InputLegacy = (p: JSX.IntrinsicElements['input']): JSX.Element => {
    const { className, children, ...rest } = p
    return (
        <input tw={['csuite-basic-input', className]} {...rest}>
            {children}
        </input>
    )
}
export const InputNumberBase = observer(function InputNumberBase_(
    //
    p: JSX.IntrinsicElements['input'] & { _size?: RSSize },
) {
    const sizeClass = p._size ? `input-${p._size}` : null
    return (
        <input //
            type='number'
            tw={['input input-sm', sizeClass]}
            {...p}
        ></input>
    )
})

export const Radio = observer(function Radio_(p: JSX.IntrinsicElements['input']) {
    return (
        <input //
            type='radio'
            {...p}
        ></input>
    )
})

export const Toggle = observer(function Toggle_(p: JSX.IntrinsicElements['input']) {
    return (
        <input //
            type='checkbox'
            {...p}
            tw={[
                'toggle toggle-primary',
                // p.checked && 'toggle-success',
            ]}
        ></input>
    )
})

// misc
export const Surface = (p: {
    //
    header?: ReactNode
    className?: string
    children: ReactNode
}): JSX.Element => {
    const { header, children, ...rest } = p
    return (
        <div
            //
            // style={{ border: '1px solid #404040' }}
            tw='p-2 border border-opacity-25 bg-opacity-50 border-base-content input-bordered rounded-btn'
            {...rest}
        >
            {header}
            {p.children}
        </div>
    )
}

export const ProgressLine = observer(function ProgressLine_(p: {
    //
    className?: string
    percent?: number
    status: 'success' | 'active'
}) {
    const status = p.status === 'success' ? 'progress-success' : 'progress-info'
    return (
        <progress
            //
            tw={[status, 'm-0 progress', p.className]}
            value={p.percent}
            max={100}
        ></progress>
    )
})

// ------------------------------------------------------------------------
const messageIcon = (type: MessageType): ReactNode => {
    if (type === 'error') return <span className='material-symbols-outlined !text-xl'>error</span>
    if (type === 'info') return <span className='material-symbols-outlined !text-xl'>info</span>
    if (type === 'warning') return <span className='material-symbols-outlined !text-xl'>warning</span>
    exhaust(type)
    return null
}
type MessageType = 'error' | 'info' | 'warning'
export const Message = observer(function Message_(p: {
    //
    type: MessageType
    header?: ReactNode
    showIcon?: boolean
    children?: ReactNode
}) {
    const { showIcon, ...rest } = p
    return (
        <div
            tw={[
                p.type === 'error' //
                    ? 'bg-error text-error-content'
                    : p.type === 'warning'
                      ? 'bg-warning text-warning-content'
                      : 'bg-base',
            ]}
            {...rest}
        >
            {p.header}
            <div
                //
                className='flex flex-wrap items-center gap-2 p-2'
            >
                {messageIcon(p.type)}
                <div>{p.children}</div>
            </div>
        </div>
    )
})

export const Loader = observer((p: { size?: RSSize; className?: string }) => (
    <span
        //
        className={p.className}
        tw={[`loading loading-spinner loading-${p.size ?? 'sm'}`]}
    ></span>
))
