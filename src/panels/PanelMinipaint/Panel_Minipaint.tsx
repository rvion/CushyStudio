// https://github.com/devforth/painterro
import type { MediaImageL } from '../../models/MediaImage'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo } from 'react'

import { Button } from '../../csuite/button/Button'
import { knownOKLCHHues } from '../../csuite/tinyCSS/knownHues'
import { Panel, type PanelHeader } from '../../router/Panel'
import { CUSHY_PORT } from '../../state/PORT'
import { useSt } from '../../state/stateContext'
import { MinipaintState } from './MinipaintState'

export const PanelMinipaint = new Panel({
    name: 'Paint',
    widget: (): React.FC<PanelMinipaintProps> => Panel_Minipaint,
    header: (p): PanelHeader => ({ title: '🎨 Paint' }),
    def: (): PanelMinipaintProps => ({}),
    icon: 'mdiPencil',
    category: 'tools',
})

export type PanelMinipaintProps = {
    imgID?: MediaImageID
}

export const Panel_Minipaint = observer(function PaintUI_(p: PanelMinipaintProps) {
    const st = useSt()
    const uist = useMemo(() => new MinipaintState(st), [])

    // load image once the widget is ready
    useLayoutEffect(() => {
        if (p.imgID == null) return
        const img: MediaImageL = st.db.media_image.getOrThrow(p.imgID)
        setTimeout(() => uist.loadImage(img), 100)
    }, [p.imgID])

    return (
        <div className='flex-grow flex flex-col h-full'>
            <div className='top-1 right-2'>
                <div className='flex items-center gap-2'>
                    <Button
                        tw='join-item'
                        size='sm'
                        icon='mdiContentSave'
                        look='primary'
                        base={{ hue: knownOKLCHHues.success }}
                        onClick={() => runInAction(() => uist.saveImage())}
                    >
                        Save
                    </Button>
                    <Button
                        tw={['btn btn-sm self-start', uist.autoSave ? 'btn-active' : null]}
                        icon='mdiRepeat'
                        loading={Boolean(uist.autoSave)}
                        onClick={() => uist.toggleAutoSave()}
                    >
                        AutoSave
                    </Button>
                    <div>
                        outputs/minipaint/
                        <input
                            onChange={(ev) => (uist.fileName = ev.target.value)}
                            value={uist.fileName}
                            tw='csuite-basic-input'
                            type='text'
                        />
                        .png
                    </div>
                </div>
            </div>
            <iframe
                style={{
                    border: 'none',
                    flexGrow: 1,
                    minWidth: '200px',
                    width: '100%',
                    // resize: 'both',
                    // minHeight: '100%',
                    // height: '612px',
                }}
                id='miniPaint'
                src={`http://localhost:${CUSHY_PORT}/minipaint/index.html`}
                allow='camera'
            ></iframe>

            {/* <div id={uid} ref={ref} style={{ position: 'relative', minWidth: '100%', minHeight: '800px', maxHeight: '800px' }}>
                <div dangerouslySetInnerHTML={{ __html: `<div id="${uid}">🟢</div>` }}></div>
            </div> */}
        </div>
    )
})
