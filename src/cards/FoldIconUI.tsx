import { observer } from 'mobx-react-lite'

export const FoldIconUI = observer(function FoldIconUI_(p: {
    //
    val?: boolean
    set?: (next: boolean) => void
}) {
    const val = p.val ?? false
    return (
        <label className='swap swap-rotate opacity-50'>
            <input
                type='checkbox'
                checked={val}
                onChange={(ev) => {
                    p.set?.(!ev.target.checked)
                }}
            />
            <span className='material-symbols-outlined swap-on'>keyboard_arrow_right</span>
            <span className='material-symbols-outlined swap-off'>keyboard_arrow_down</span>
        </label>
    )
})
