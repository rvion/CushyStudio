import { Runtime } from 'src/back/Runtime'

export function prettifyIconAt(flow: Runtime, p: { path: Enum_LoadImage_image; scaleRatio: number }) {
    return prettifyIcon(flow, {
        image: flow.nodes.LoadImage({ image: p.path }),
        scaleRatio: p.scaleRatio,
    })
}

export function prettifyIcon(
    flow: Runtime,
    p: {
        //
        image: _IMAGE & _MASK
        /** 1.2 recommanded */
        scaleRatio: number
    },
): _IMAGE {
    const graph = flow.nodes
    const asset = p.image

    const assetWithAlpha = graph.JoinImageWithAlpha({ image: asset, alpha: asset })

    const image_Resize_1 = graph.Image_Resize({
        mode: 'rescale',
        supersample: 'true',
        resampling: 'nearest',
        rescale_factor: 1.25,
        image: asset,
    })
    // const imageColorToMask_1 = graph.ImageColorToMask({ color: 0, image: image_Resize_1 })
    const image_Levels_Adjustment_1 = graph.Image_Levels_Adjustment({
        black_level: 0.1,
        mid_level: 7.300000000000001,
        white_level: 9.4,
        image: image_Resize_1,
    })
    // const img = 'Radial 1 - 512x512.png'
    const img = 'Circular 10 - 512x512.png' as any
    const loadImageMask_1 = graph.LoadImageMask({ image: img, channel: 'blue' })
    // const loadImageMask_1 = graph.Image_Resize({
    //     image:loadImageMask_11,
    //     mode:'resize',
    //     resize_height: graph.Get_Image_Size({image: asset}).INT_1,
    //     resize_width: graph.Get_Image_Size({image: asset}).INT_1,
    // })

    const maskComposite_1 = graph.MaskComposite({
        x: 0,
        y: 0,
        operation: 'add',
        destination: asset,
        source: loadImageMask_1,
    })
    const joinImageWithAlpha_3 = graph.JoinImageWithAlpha({
        image: image_Levels_Adjustment_1,
        alpha: maskComposite_1,
    })
    const preview_2 = graph.PreviewImage({ images: joinImageWithAlpha_3 })
    const imageCompositeRelative_1 = graph.ImageCompositeRelative({
        images_a_x: 0.5,
        images_a_y: 0.49,
        images_b_x: 0,
        images_b_y: 0,
        background: 'images_b',
        container_size_type: 'max',
        method: 'pair',
        images_a: assetWithAlpha,
        images_b: joinImageWithAlpha_3,
    })
    return imageCompositeRelative_1
}
