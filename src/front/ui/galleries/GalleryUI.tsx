import { observer } from 'mobx-react-lite'
import { IconButton, Input, Slider, Toggle } from 'rsuite'
import { useSt } from '../../FrontStateCtx'
import { ImageUI } from './ImageUI'

export const GalleryUI = observer(function VerticalGalleryUI_(p: {}) {
    const st = useSt()
    const preview = st.preview
    return (
        <div //
            className='flex flex-wrap col-folder'
            style={{
                borderRight: '1px solid #383838',
                background: st.configFile.value.galleryBgColor,
            }}
        >
            {/* MAIN IMAGE COLUMN */}
            <div className='flex flex-wrap items-start'>
                <div tw='text-center w-full'>
                    <div tw='flex gap-2'>
                        {/* IMAGE SIZE === */}
                        <div tw='self-start w-fit'>
                            <div tw='text-gray-400'>Image size</div>
                            <Slider
                                tw='m-2'
                                style={{ width: '5rem' }}
                                min={32}
                                max={200}
                                onChange={(v) => (st.gallerySize = v)}
                                value={st.gallerySize}
                            ></Slider>
                        </div>
                        <div tw='self-start w-fit'>
                            <div tw='text-gray-400'>background</div>
                            <div tw='flex'>
                                <IconButton
                                    tw='!px-1 !py-0'
                                    icon={<span className='material-symbols-outlined'>format_color_reset</span>}
                                    size='xs'
                                    onClick={() => st.configFile.update({ galleryBgColor: undefined })}
                                ></IconButton>
                                <Input
                                    type='color'
                                    tw='p-0 m-0 border'
                                    style={{ width: '5rem' }}
                                    value={st.configFile.value.galleryBgColor ?? undefined}
                                    onChange={(ev) => st.configFile.update({ galleryBgColor: ev })}
                                ></Input>
                            </div>
                        </div>
                        <div tw='self-start w-fit'>
                            <div tw='text-gray-400'>
                                <div>full-screen</div>
                                <Toggle
                                    size='sm'
                                    checked={st.showPreviewInFullScreen ?? true}
                                    onChange={(next) => (st.showPreviewInFullScreen = next)}
                                />
                            </div>
                        </div>
                        <div tw='self-start w-fit'>
                            <div tw='text-gray-400'>hover opacity</div>
                            <Slider
                                tw='m-2'
                                style={{ width: '5rem' }}
                                step={0.01}
                                min={0}
                                max={1}
                                onChange={(v) => (st.galleryHoverOpacity = v)}
                                value={st.galleryHoverOpacity}
                            ></Slider>
                        </div>
                    </div>
                </div>
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
