export const ui_saveAllImages = () => {
    const form = getCurrentForm()
    return form.groupOpt({
        label: 'Compress',
        startActive: true,
        startCollapsed: true,
        items: () => ({
            format: form.selectOne({
                label: 'Format',
                choices: [
                    { id: 'webp', label: 'WebP' },
                    { id: 'png', label: 'PNG' },
                    { id: 'jpg', label: 'JPG' },
                ],
            }),
            quality: form.float({
                default: 0.8,
                min: 0,
                max: 1,
                step: 0.1,
            }),
        }),
    })
}

/** need to be called after `await run.PROMPT()`, not before */
export const run_saveAllImages = async (
    p: {
        //
        format?: 'webp'
        quality?: number
    } = {},
) => {
    const run = getCurrentRun()
    // 1. build canvas
    const canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')

    console.log(`[💪] found ${run.generatedImages.length} images`)

    // 2. for every image generated
    for (const img of run.generatedImages) {
        // if (img.ComfyNodeMetadta?.tag !== 'final-image') {
        //     console.log(`[💪] skipping file ${img.url} because it doesnt' have tag "final-image"`)
        //     continue
        // }
        // get canvas size (use 'image-meta' that supports all the image file formats you can think of)
        const width = img.data.width
        const height = img.data.height

        // resize the canvas accordingly
        canvas.width = width
        canvas.height = height

        // paste html image onto your canvas
        const imgHtml = await run.Konva.createHTMLImage_fromURL(img.url)
        ctx!.drawImage(imgHtml, 0, 0, width, height)

        // get the binary image data (as base64)
        // (https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toDataURL)
        let dataUrl = canvas.toDataURL('image/webp', p.quality)
        let base64Data = dataUrl.replace(/^data:image\/webp;base64,/, '')

        // non-integrated with CushyStudio way of saving an image
        run.fs.mkdirSync('outputs/_b64', { recursive: true })
        const relPath = `outputs/_b64/output-${img.id}.webp` as RelativePath
        run.fs.writeFileSync(relPath, base64Data, 'base64')

        // register it on cushy
        const newImg = run.Images.createFromPath(relPath, { promptID: img.prompt?.id })
    }
}
