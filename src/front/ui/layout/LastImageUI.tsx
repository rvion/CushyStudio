import { observer } from 'mobx-react-lite'
import { useSt } from 'src/front/FrontStateCtx'

export const LastImageUI = observer(function LastImageUI_(p: {}) {
    const st = useSt()
    const imgs = st.db.images.last()
    if (imgs == null) return null
    return (
        <img
            style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
            }}
            src={imgs.url}
            alt='last generated image'
        />
    )
})
