import { ReactNode } from 'react'

export type PositionChildProps = {
    top: number
    left: number
    className: string
}
export type ItemDataType = {
    value: string
    children: ItemDataType[]
    label: string
}

type RSColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue'
type RSSize = 'sm' | 'xs' | 'md' | 'lg'
type RSAppearance = 'default' | 'subtle' | 'ghost' | 'link' | 'primary'
export type TypeAttributes = {
    Color: RSColor
    Size: RSSize
    Appearance: RSAppearance
}
// form
export const Form = (p: any) => <div {...p}></div>
export const FormHelpText = (p: any) => <div {...p}></div>
export const FormControlLabel = (p: JSX.IntrinsicElements['label']) => <label {...p}></label>
export const FormControl = (p: JSX.IntrinsicElements['input']) => <input tw='input input-sm' {...p}></input>
// input groups
export const FormGroup = (p: {}) => <div tw='join' {...p}></div>
export const InputGroup = (p: {}) => <div tw='join' {...p}></div>
export const ButtonGroup = (p: {}) => <div tw='join' {...p}></div>
export const RadioGroup = (p: {}) => <div tw='join' {...p}></div>
export const RadioTileGroup = (p: {}) => <div tw='join' {...p}></div>

export const InputGroupAddon = (p: any) => <div {...p}></div>

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
) => (
    <button
        {...p}
        tw={[
            'btn',
            p.loading || p.disabled ? 'btn-disabled' : null,
            p.active ? 'btn-active' : null,
            p.appearance
                ? (() => {
                      if (p.appearance === 'primary') return 'btn-primary'
                      if (p.appearance === 'ghost') return 'btn-outline'
                      if (p.appearance === 'link') return 'btn-link'
                      if (p.appearance === 'default') return null
                      if (p.appearance === 'subtle') return null
                      return exhaust(p.appearance)
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

export const Input = (p: JSX.IntrinsicElements['input']) => (
    <input //
        {...p}
    ></input>
)
export const InputNumberBase = (p: JSX.IntrinsicElements['input']) => (
    <input //
        type='number'
        {...p}
        tw={['input input-sm', ...(p.tw ?? [])]}
    ></input>
)
export const Slider = (p: JSX.IntrinsicElements['input']) => (
    <input //
        type='range'
        {...p}
        tw={[...(p.tw ?? []), 'range range-info']}
    ></input>
)
export const Radio = (p: JSX.IntrinsicElements['input']) => (
    <input //
        type='radio'
        {...p}
    ></input>
)
export const Toggle = (p: JSX.IntrinsicElements['input']) => (
    <input //
        type='checkbox'
        {...p}
        tw={[...(p.tw ?? []), 'toggle']}
    ></input>
)
export const SelectPicker = (p: any) => <select {...p}></select>
export const TagPicker = (p: any) => <select multiple {...p}></select>
export const MultiCascader = (p: any) => <select multiple {...p}></select>
export const Tree = (p: any) => <div {...p}></div>
export const Rate = (p: {}) => (
    <div tw='rating rating-sm'>
        <input type='radio' tw='mask mask-star fade-in-40' {...p}></input>
        <input type='radio' tw='mask mask-star fade-in-40' {...p}></input>
        <input type='radio' tw='mask mask-star fade-in-40' {...p}></input>
        <input type='radio' tw='mask mask-star fade-in-40' {...p}></input>
        <input type='radio' tw='mask mask-star fade-in-40' {...p}></input>
    </div>
)

// tooltips
export const Whisper = (p: any) => <div {...p}></div>
export const Speaker = (p: any) => <div {...p}></div>
export const Popover = (p: any) => <div {...p}></div>
export const Tooltip = (p: any) => <div {...p}></div>
// modals
export const Modal = (p: any) => <div {...p}></div>
export const ModalHeader = (p: any) => <div {...p}></div>
export const ModalTitle = (p: any) => <div {...p}></div>
export const ModalBody = (p: any) => <div {...p}></div>
export const ModalFooter = (p: any) => <div {...p}></div>
// navs
export const Nav = (p: any) => <div {...p}></div>
export const NavItem = (p: any) => <div {...p}></div>
// menus
export const Menu = (p: any) => <div {...p}></div>
export const MenuBar = (p: any) => <div {...p} />
export const Dropdown = (p: {
    style?: React.CSSProperties
    startIcon?: Maybe<ReactNode>
    title: ReactNode
    appearance?: Maybe<RSAppearance>
    children: ReactNode
}) => (
    <div className='dropdown'>
        <label tabIndex={0} tw='btn btn-neutral btn-sm m-1'>
            {p.startIcon} {p.title}
        </label>
        <ul tabIndex={0} tw='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52'>
            {p.children}
        </ul>
    </div>
)
export const DropdownMenu = (p: any) => <div {...p}></div>
export const DropdownItem = (p: any) => <li {...p}></li>
// misc
export const Panel = (p: any) => (
    <div
        //
        style={{ border: '1px solid #404040' }}
        tw='p-2'
        {...p}
    ></div>
)
export const Progress = (p: any) => <div {...p}></div>
export const Message = (p: any) => <div {...p}></div>
export const Tag = (p: any) => <div {...p}></div>
export const Loader = (p: any) => <div {...p}></div>
// misc 2
export const RadioTile = (p: any) => <div {...p}></div>
