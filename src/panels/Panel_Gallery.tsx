import { observer } from 'mobx-react-lite'
import { Button, Input, Slider, Toggle } from 'src/rsuite/shims'
import { useSt } from '../state/stateContext'
import { ImageUI } from '../widgets/galleries/ImageUI'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { FieldAndLabelUI } from 'src/widgets/misc/FieldAndLabelUI'

export const Panel_Gallery = observer(function VerticalGalleryUI_(p: {}) {
    const st = useSt()
    const preview = st.preview
    return (
        <div //
            className='flex flex-col bg-base-200 h-full'
            style={{
                // borderRight: '1px solid #383838',
                background: st.configFile.value.galleryBgColor,
            }}
        >
            <div tw='flex overflow-auto gap-2 px-2 bg-base-300 w-full flex-shrink-0'>
                <FieldAndLabelUI label='Size'>
                    <Slider
                        style={{ width: '3rem' }}
                        min={32}
                        max={200}
                        onChange={(ev) => (st.gallerySize = parseFloatNoRoundingErr(ev.target.value))}
                        value={st.gallerySize}
                    />
                </FieldAndLabelUI>
                <FieldAndLabelUI label='background'>
                    <div tw='join'>
                        <Button
                            tw='btn-neutral join-item '
                            icon={<span className='material-symbols-outlined'>format_color_reset</span>}
                            size='xs'
                            onClick={() => st.configFile.update({ galleryBgColor: undefined })}
                        />
                        <Input
                            tw='join-item input-xs'
                            type='color'
                            value={st.configFile.value.galleryBgColor ?? undefined}
                            onChange={(ev) => st.configFile.update({ galleryBgColor: ev.target.value })}
                        />
                    </div>
                </FieldAndLabelUI>
                <FieldAndLabelUI label='full-screen'>
                    <Toggle
                        checked={st.showPreviewInFullScreen ?? true}
                        onChange={(ev) => (st.showPreviewInFullScreen = ev.target.checked)}
                    />
                </FieldAndLabelUI>
                <FieldAndLabelUI label='in-panel'>
                    <Toggle
                        checked={st.isConfigValueEq('showPreviewInPanel', true)}
                        onChange={(ev) => st.setConfigValue('showPreviewInPanel', ev.target.checked)}
                    />
                </FieldAndLabelUI>
                <FieldAndLabelUI label='hover opacity'>
                    <Slider
                        style={{ width: '5rem' }}
                        step={0.01}
                        min={0}
                        max={1}
                        onChange={(ev) => (st.galleryHoverOpacity = parseFloatNoRoundingErr(ev.target.value))}
                        value={st.galleryHoverOpacity}
                    />
                </FieldAndLabelUI>
            </div>
            {/* MAIN IMAGE COLUMN */}
            <div className='flex flex-wrap overflow-auto'>
                {preview ? ( //
                    <img
                        //
                        style={{
                            objectFit: 'contain',
                            opacity: 1,
                            padding: '0.2rem',
                            borderRadius: '.5rem',
                            width: st.gallerySizeStr,
                            height: st.gallerySizeStr,
                        }}
                        src={preview.url}
                        onMouseEnter={(ev) => (st.hovered = { type: 'image', url: preview.url })}
                        onMouseLeave={() => {
                            if (st.hovered?.url === preview.url) st.hovered = null
                        }}
                    />
                ) : null}

                {st.imageToDisplay.map((img, ix) => (
                    <ImageUI key={ix} img={img} />
                ))}
            </div>
        </div>
    )
})
