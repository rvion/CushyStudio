import { Runtime } from 'src/back/Runtime'

export function TEST(flow: Runtime) {
    const graph = flow.nodes
    const load_1 = graph.LoadImage({ image: 'poker-heart.png' })
    const joinImageWithAlpha_2 = graph.JoinImageWithAlpha({ image: load_1.IMAGE, alpha: load_1.MASK })
    const image_Resize_1 = graph.Image_Resize({
        mode: 'rescale',
        supersample: 'true',
        resampling: 'nearest',
        rescale_factor: 1.25,
        resize_width: 1024,
        resize_height: 1536,
        image: load_1.IMAGE,
    })
    const imageColorToMask_1 = graph.ImageColorToMask({ color: 0, image: image_Resize_1.IMAGE })
    const image_Levels_Adjustment_1 = graph.Image_Levels_Adjustment({
        black_level: 0.1,
        mid_level: 7.300000000000001,
        white_level: 9.4,
        image: image_Resize_1.IMAGE,
    })
    const loadImageMask_1 = graph.LoadImageMask({ image: 'Radial 1 - 512x512.png', channel: 'blue' })
    const maskComposite_1 = graph.MaskComposite({
        x: 0,
        y: 0,
        operation: 'add',
        destination: load_1.MASK,
        source: loadImageMask_1.MASK,
    })
    const joinImageWithAlpha_3 = graph.JoinImageWithAlpha({
        image: image_Levels_Adjustment_1.IMAGE,
        alpha: maskComposite_1.MASK,
    })
    const preview_2 = graph.PreviewImage({ images: joinImageWithAlpha_3.IMAGE })
    const imageCompositeRelative_1 = graph.ImageCompositeRelative({
        images_a_x: 0.5,
        images_a_y: 0.49,
        images_b_x: 0,
        images_b_y: 0,
        background: 'images_b',
        container_size_type: 'max',
        method: 'pair',
        images_a: joinImageWithAlpha_2.IMAGE,
        images_b: joinImageWithAlpha_3.IMAGE,
    })
    const preview_3 = graph.PreviewImage({ images: imageCompositeRelative_1.IMAGE })
    const imageTextOutlined_1 = graph.ImageTextOutlined({
        text: '',
        font: 'Roboto-Regular.ttf',
        size: 28,
        red: 255,
        green: 255,
        blue: 255,
        outline_size: 1,
        outline_red: 0,
        outline_green: 0,
        outline_blue: 0,
        alpha: 1,
        margin_x: 0,
        margin_y: 0,
    })
}
