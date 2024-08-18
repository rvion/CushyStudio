import { observer } from 'mobx-react-lite'

import { useSt } from '../../state/stateContext'

export const SamplerPreviewImageUI = observer(function SamplerPreviewImageUI_(p: {}) {
    const st = useSt()
    // const [{ opacity }, dragRef] = useImageDrag(image)
    // {
    //     st.preview ? <img style={{ width: '64px', height: '64px' }} src={st.preview.url} /> : null
    // }
    return <div></div>
})
