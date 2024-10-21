import type { MediaImageL } from '../../models/MediaImage'

import { observer } from 'mobx-react-lite'
import { FixedSizeGrid } from 'react-window'

import { useSizeOf } from '../../csuite/smooth-size/useSizeOf'
import { ImageUI } from '../../widgets/galleries/ImageUI'
import { useGalleryConf } from './galleryConf'

export const GalleryImageGridUI = observer(function GalleryImageGridUI_(p: {
    /** when not specified, it will just open the default image menu */
    onClick?: (img: MediaImageL) => void
}) {
    const { ref: refFn, size } = useSizeOf()
    const conf = useGalleryConf()
    const ALLIMAGES = conf.imageToDisplay
    const total = ALLIMAGES.length

    const itemWidth = conf.value.gallerySize
    const itemHeight = conf.value.gallerySize
    const containerWidth = size.width ?? 100
    const containerHeight = size.height ?? 100
    const nbCols = Math.floor(containerWidth / itemWidth) || 1
    const nbRows = Math.ceil(total / nbCols)
    return (
        <div //
            ref={refFn}
            tw='flex-1'
            // applying filter on the whole gallery is way faster than doing it on every individual images
            style={conf.value.onlyShowBlurryThumbnails ? { filter: 'blur(10px)' } : undefined}
        >
            {conf.Virtualized.value ? (
                // alt 1. virtualized grid
                <FixedSizeGrid
                    height={containerHeight}
                    width={containerWidth}
                    columnCount={nbCols}
                    rowCount={nbRows}
                    columnWidth={itemWidth}
                    rowHeight={itemHeight}
                >
                    {({ columnIndex, rowIndex, style }) => {
                        const img = ALLIMAGES[rowIndex * nbCols + columnIndex]
                        if (img == null) return null
                        return (
                            <ImageUI //
                                onClick={p.onClick}
                                size={itemWidth}
                                img={img}
                                style={style}
                            />
                        )
                    }}
                </FixedSizeGrid>
            ) : (
                // alt 2. a simple flex wrap
                <div tw='flex flex-wrap'>
                    {ALLIMAGES.map((i) => (
                        <ImageUI //
                            key={i.id}
                            onClick={p.onClick}
                            size={itemWidth}
                            img={i}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})
