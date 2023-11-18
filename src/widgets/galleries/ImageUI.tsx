import type { STATE } from 'src/state/state'

import { observer } from 'mobx-react-lite'
import { ImageL } from 'src/models/Image'
import { DropdownMenu, Popover, PositionChildProps, Whisper } from 'src/rsuite/shims'
import { MenuItem } from 'src/rsuite/Dropdown'
import { useSt } from '../../state/stateContext'
import { useImageDrag } from './dnd'

export const ImageUI = observer(function ImageUI_(p: { img: ImageL }) {
    const image = p.img
    const st = useSt()
    const GalleryImageWidth = st.gallerySizeStr
    const [{ opacity }, dragRef] = useImageDrag(image)

    const IMG =
        image.data.type === 'video' ? (
            <video
                //
                onMouseEnter={(ev) => (st.hovered = { type: 'video', url: image.url })}
                onMouseLeave={() => {
                    if (st.hovered?.url === image.url) st.hovered = null
                }}
                style={{
                    //
                    width: GalleryImageWidth,
                    height: GalleryImageWidth,
                }}
                src={image.url}
            ></video>
        ) : (
            <img
                src={image.url}
                ref={dragRef}
                loading='lazy'
                onMouseEnter={(ev) => (st.hovered = { type: 'image', url: image.url })}
                onMouseLeave={() => {
                    if (st.hovered?.url === image.url) st.hovered = null
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
                    st.layout.addImage(image.id)
                    // st.lightBox.opened = true
                    // st.lightBox.getImgs
                }}
            />
        )
    return (
        <>
            {/* right click logic 👇 */}
            <Whisper
                placement='auto'
                trigger='contextMenu'
                speaker={(...props) => renderSpeaker(st, image, ...props)}
                //
            >
                <div>{IMG}</div>
            </Whisper>
            {/* {IMG} */}
        </>
    )
})

export const PlaceholderImageUI = observer(function PlaceholderImageUI_(p: {}) {
    const st = useSt()
    const GalleryImageWidth = st.configFile.value.galleryImageSize ?? 48
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
    st: STATE,
    img: ImageL,
    { onClose, left, top, className, ...rest }: SpeakerProps,
    ref: React.RefCallback<HTMLElement>,
) => {
    const handleSelect = (eventKey: number | string | undefined) => {
        onClose()
        if (eventKey === 4) {
            st.layout.addPaint(img.id)
            // st.setAction({ type: 'paint', imageID: img.id })
        }
        // ⏸️ if (eventKey === 3) {
        // ⏸️     console.log('🔴')
        // ⏸️     const db = img.st.db
        // ⏸️     const pj: ProjectL = db.projects.firstOrCrash()
        // ⏸️     const root: GraphL = pj.rootGraph.item
        // ⏸️     const ia: ImageAnswer = { type: 'CushyImage', imageID: img.id }
        // ⏸️     const step = root.createStep({
        // ⏸️         toolID: db.tools.findOrCrash((t) => t.name.endsWith('start from image')).id,
        // ⏸️         params: { image: ia },
        // ⏸️     })
        // ⏸️     return
        // ⏸️ }
        console.log(eventKey)
    }
    return (
        <Popover ref={ref} className={className} style={{ left, top }} full>
            <DropdownMenu onSelect={handleSelect}>
                <MenuItem eventKey={4}>Paint</MenuItem>
                <MenuItem eventKey={4}>Mask</MenuItem>
                {/* <DropdownMenu title='Edit'>
                    <DropdownItem eventKey={1}>New File</DropdownItem>
                    <DropdownItem eventKey={2}>New File with Current Profile</DropdownItem>
                </DropdownMenu> */}
                {/* <DropdownItem eventKey={3}>Start Flow from this</DropdownItem> */}
                {/* <DropdownItem eventKey={4}>Export PDF</DropdownItem>
                <DropdownItem eventKey={5}>Export HTML</DropdownItem>
                <DropdownItem eventKey={6}>Settings</DropdownItem>
                <DropdownItem eventKey={7}>About</DropdownItem> */}
            </DropdownMenu>
        </Popover>
    )
}
