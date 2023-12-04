import { observer } from 'mobx-react-lite'

export const FoldIconUI = observer(function FoldIconUI_(p: {
    //
    val: boolean
    set?: (next: boolean) => void
}) {
    return (
        <label className='swap swap-rotate'>
            <input
                type='checkbox'
                checked={!p.val}
                onChange={(ev) => {
                    p.set?.(!ev.target.checked)
                }}
            />
            <span className='material-symbols-outlined swap-on'>keyboard_arrow_right</span>
            <span className='material-symbols-outlined swap-off'>keyboard_arrow_down</span>
        </label>
    )
})
