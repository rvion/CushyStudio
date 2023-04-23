import { observer } from 'mobx-react-lite'
import { Tooltip, Whisper } from 'rsuite'
import { useSt } from '../core-front/stContext'

export const PreviewListUI = observer(function PreviewListUI_(p: {}) {
    const st = useSt()
    return (
        <div style={{ display: 'flex', overflowX: 'auto', width: '100%', gap: '.1rem' }}>
            {st.images.map((i, ix) => (
                <Whisper
                    key={ix}
                    // trigger='click'
                    placement='bottomStart'
                    speaker={
                        <Tooltip>
                            <img style={{ objectFit: 'contain', maxHeight: 'unset', maxWidth: 'unset' }} key={i} src={i} />
                        </Tooltip>
                    }
                >
                    <img style={{ objectFit: 'contain', width: '32px', height: '32px' }} key={i} src={i} />
                </Whisper>
            ))}
        </div>
    )
})
