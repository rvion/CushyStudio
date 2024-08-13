import { observer } from 'mobx-react-lite'

export const InputSliderUI_legacy = observer(function Slider_(p: JSX.IntrinsicElements['input']) {
    return <input type='range' {...p} tw='range range-sm range-primary' />
})
