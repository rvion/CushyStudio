import type { GraphL } from 'src/models/Graph'
import type { ProjectL } from 'src/models/Project'

import { observer } from 'mobx-react-lite'
import { Dropdown, Popover, Whisper } from 'rsuite'
import { PositionChildProps } from 'rsuite/esm/Picker'
import { ImageAnswer } from 'src/controls/InfoAnswer'
import { ImageL } from 'src/models/Image'
import { useSt } from '../../FrontStateCtx'
import { useImageDrag } from './dnd'

export const GalleryImageWidth = '48px'
export const ImageUI = observer(function ImageUI_(p: { img: ImageL }) {
    const image = p.img
    const st = useSt()
    const [{ opacity }, dragRef] = useImageDrag(image)

    const IMG = (
        <img
            className='scale-in-center'
            ref={dragRef}
            loading='lazy'
            onMouseEnter={(ev) => {
                st.hovered = image
            }}
            onMouseLeave={() => {
                if (st.hovered === image) st.hovered = null
            }}
            style={{
                objectFit: 'contain',
                width: GalleryImageWidth,
                height: GalleryImageWidth,
                opacity,
                padding: '0.2rem',
                borderRadius: '.5rem',
            }}
            // onAuxClick={(e) => {
            //     st.hovered = null
            //     st.currentAction = { type: 'paint', imageID: image.id }
            // }}
            onClick={() => {
                st.lightBox.opened = true
                st.lightBox.getImgs
            }}
            src={image.url}
        />
    )
    return (
        <>
            <Whisper
                placement='bottomStart'
                trigger='contextMenu'
                speaker={(...props) => renderSpeaker(image, ...props)}
                //
            >
                <div>{IMG}</div>
            </Whisper>
            {/* {IMG} */}
        </>
    )
})

export const PlaceholderImageUI = observer(function PlaceholderImageUI_(p: {}) {
    return (
        <div
            className='scale-in-center'
            style={{
                objectFit: 'contain',
                width: GalleryImageWidth,
                height: GalleryImageWidth,
                padding: '0.2rem',
                borderRadius: '.5rem',
            }}
        />
    )
})

type SpeakerProps = { onClose: (delay?: number) => NodeJS.Timeout | void } & PositionChildProps

const renderSpeaker = (
    //
    img: ImageL,
    { onClose, left, top, className, ...rest }: SpeakerProps,
    ref: React.RefCallback<HTMLElement>,
) => {
    const handleSelect = (eventKey: number | string | undefined) => {
        onClose()
        if (eventKey === 3) {
            console.log('🔴')
            const db = img.st.db
            const pj: ProjectL = db.projects.firstOrCrash()
            const root: GraphL = pj.rootGraph.item
            const ia: ImageAnswer = { type: 'imageID', imageID: img.id }
            const step = root.createStep({
                toolID: db.tools.findOrCrash((t) => t.name.endsWith('start from image')).id,
                params: { image: ia },
            })
            return
        }
        console.log(eventKey)
    }
    return (
        <Popover ref={ref} className={className} style={{ left, top }} full>
            <Dropdown.Menu onSelect={handleSelect}>
                <Dropdown.Menu title='Edit'>
                    <Dropdown.Item eventKey={1}>New File</Dropdown.Item>
                    <Dropdown.Item eventKey={2}>New File with Current Profile</Dropdown.Item>
                </Dropdown.Menu>
                <Dropdown.Item eventKey={3}>Start Flow from this</Dropdown.Item>
                {/* <Dropdown.Item eventKey={4}>Export PDF</Dropdown.Item>
                <Dropdown.Item eventKey={5}>Export HTML</Dropdown.Item>
                <Dropdown.Item eventKey={6}>Settings</Dropdown.Item>
                <Dropdown.Item eventKey={7}>About</Dropdown.Item> */}
            </Dropdown.Menu>
        </Popover>
    )
}
