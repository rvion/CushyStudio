import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { RevealUI } from './reveal/RevealUI'
import { RSAppearance, RSSize } from './RsuiteTypes'
import { exhaust } from 'src/utils/misc/ComfyUtils'

// form
export const FormHelpText = (p: any) => <div {...p}></div>
export const FormControlLabel = (p: JSX.IntrinsicElements['label']) => <label {...p}></label>
export const FormControl = (p: JSX.IntrinsicElements['input']) => <input tw='input input-bordered input-sm' {...p}></input>
export const Joined = (p: { className?: string; children?: ReactNode }) => (
    <div tw={[p.className, 'join virtualBorder']}>{p.children}</div>
)

export const Addon = observer(function Addon_(p: any) {
    return <div tw='flex items-center px-2 join-item' {...p}></div>
})

// inputs
export const Button = (
    p: JSX.IntrinsicElements['button'] & {
        icon?: Maybe<ReactNode>
        active?: Maybe<boolean>
        size?: Maybe<RSSize>
        loading?: boolean
        disabled?: boolean
        appearance?: Maybe<RSAppearance>
    },
) => {
    const { icon, active, size, loading, disabled, appearance, ...rest } = p
    return (
        <button
            {...rest}
            tw={[
                'btn',
                p.loading || p.disabled ? 'btn-disabled' : null,
                p.active ? 'btn-active' : null,
                appearance
                    ? (() => {
                          if (appearance === 'primary') return 'btn-primary'
                          if (appearance === 'ghost') return 'btn-outline'
                          if (appearance === 'link') return 'btn-link'
                          if (appearance === 'default') return null
                          if (appearance === 'subtle') return null
                          return exhaust(appearance)
                      })()
                    : null,
                p.size
                    ? (() => {
                          if (p.size === 'sm') return 'btn-sm'
                          if (p.size === 'xs') return 'btn-xs'
                          if (p.size === 'lg') return 'btn-lg'
                          if (p.size === 'md') return null
                          return exhaust(p.size)
                      })()
                    : null,
                ...(p?.tw ?? []),
            ]}
        >
            {p.icon}
            {p.children}
        </button>
    )
}

export const Input = (p: JSX.IntrinsicElements['input']) => {
    const { tw, className, children, ...rest } = p
    return (
        <input tw={[tw, className, 'input input-bordered input-sm']} {...rest}>
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

export const Slider = observer(function Slider_(p: JSX.IntrinsicElements['input']) {
    return (
        <input //
            type='range'
            {...p}
            tw={['range range-sm range-primary']}
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
                //
                'toggle toggle-primary',
                // p.checked && 'toggle-success',
            ]}
        ></input>
    )
})

export const SelectPicker = (p: any) => <select {...p}></select>
export const TagPicker = (p: any) => <select multiple {...p}></select>
export const MultiCascader = (p: any) => <select multiple {...p}></select>
export const Tree = (p: any) => <div {...p}></div>

// https://daisyui.com/components/rating/#mask-star-2-with-warning-color
// TODO: remove that and just use a basic btn
export const Rate = (p: {
    //
    value?: number
    name: string
    disabled?: boolean
    max?: number
    onChange?: (value: number) => void
}) => (
    <div tw='rating rating-md rating-sm'>
        {new Array(p.max ?? 1).fill(0).map((_, ix) => (
            <input
                key={ix}
                name={p.name}
                checked={p.value === ix}
                onChange={() => p.onChange?.(ix)}
                type='radio'
                tw={['mask mask-star fade-in-40', p.disabled ? 'bg-base-300' : 'bg-orange-400']}
            />
        ))}
    </div>
)

// tooltips
export const Whisper = (p: {
    /** @deprecated */
    enterable?: boolean
    /** @deprecated */
    placement?: string
    speaker: ReactNode
    children: ReactNode
}) => (
    <RevealUI>
        {p.children}
        {p.speaker}
    </RevealUI>
)
export const Speaker = (p: any) => <span {...p}></span>
export const Popover = (p: any) => <span {...p}></span>
export const Tooltip = (p: any) => <span {...p}></span>
// modals
export const Modal = (p: any) => <div {...p}></div>
export const ModalHeader = (p: any) => <div {...p}></div>
export const ModalTitle = (p: any) => <div {...p}></div>
export const ModalBody = (p: any) => <div {...p}></div>
export const ModalFooter = (p: any) => <div {...p}></div>
// navs
export const NavItem = (p: any) => <div {...p}></div>
// menus
export const Menu = (p: any) => <div {...p}></div>
export const MenuBar = (p: any) => <div {...p} />
export const DropdownMenu = (p: any) => <div {...p}></div>

// misc
export const Panel = (p: {
    //
    header?: ReactNode
    className?: string
    children: ReactNode
}) => {
    const { header, children, ...rest } = p
    return (
        <div
            //
            // style={{ border: '1px solid #404040' }}
            tw='p-2 border border-opacity-25 bg-base-200 bg-opacity-50 border-base-content input-bordered rounded-btn'
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
                    : 'bg-base text-base-content',
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
export const Tag = (p: any) => <div {...p}></div>

export const Loader = observer((p: { size?: RSSize; className?: string }) => (
    <span
        //
        className={p.className}
        tw={[`loading loading-spinner loading-${p.size ?? 'sm'}`]}
    ></span>
))

// misc 2
export const RadioTile = (p: any) => <div {...p}></div>
