import { observer } from 'mobx-react-lite'
import { FixedSizeGrid } from 'react-window'

import { useSizeOf } from '../../csuite/smooth-size/useSizeOf'
import { ImageUI } from '../../widgets/galleries/ImageUI'
import { useGalleryConf } from './galleryConf'

export const GalleryImageGridUI = observer(function GalleryImageGridUI_(p: {}) {
    const { ref: refFn, size } = useSizeOf()
    const conf = useGalleryConf()
    const ALLIMAGES = conf.imageToDisplay
    const total = ALLIMAGES.length

    // gallery conf ------------------------------------------------------
    const itemWidth = conf.value.gallerySize
    const itemHeight = conf.value.gallerySize
    const containerWidth = size.width ?? 100
    const containerHeight = size.height ?? 100
    const nbCols = Math.floor(containerWidth / itemWidth) || 1
    const nbRows = Math.ceil(total / nbCols)
    // console.log({ itemWidth, itemHeight, containerWidth, containerHeight, nbCols, nbRows })
    // ------------------------------------------------------
    return (
        <div ref={refFn} tw='flex-1'>
            <FixedSizeGrid //
                // container
                height={containerHeight}
                width={containerWidth}
                // dims
                columnCount={nbCols}
                rowCount={nbRows}
                // items
                columnWidth={itemWidth}
                rowHeight={itemHeight}
            >
                {({ columnIndex, rowIndex, style }) => {
                    const img = ALLIMAGES[rowIndex * nbCols + columnIndex]
                    if (img == null) return
                    return (
                        <div style={style}>
                            <ImageUI size='100%' img={img} />
                        </div>
                    )
                }}
            </FixedSizeGrid>
        </div>
    )
})
