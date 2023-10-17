action('The Great One (WIP)', {
    author: 'Vinsi',
    description: 'Gradiant maker',
    help: 'WIP',
    ui: (form) => ({
        model: form.enum({
            enumName: 'Enum_CheckpointLoaderSimple_ckpt_name',
            default: 'revAnimated_v122.safetensors',
            group: 'Model',
        }),

        H: form.int({ default: 768, group: 'latent' }), //normaal 768
        W: form.int({ default: 512, group: 'latent' }),
        flip: form.bool({ default: false, group: 'latent' }),
        batchSize: form.int({ default: 1, group: 'latent', min: 1 }),

        /*rotate: form.int({
            default:0, group: 'change', tooltip: 'rotate in degrees',
        }),*/

        positive: form.string({ default: '', group: 'Prompt' }),
        negative: form.string({ default: '', group: 'Prompt' }),

        theme1: form.string({ default: 'spring', group: 'Theme' }),
        theme2: form.string({ default: 'summer', group: 'Theme' }),
        theme3: form.string({ default: 'autumn', group: 'Theme' }),
        theme4: form.string({ default: 'winter', group: 'Theme' }),

        colors: form.groupOpt({
            items: () => ({
                place: form.int({ default: 0, min: 0, max: 100 }),
                red: form.int({ default: 0, min: 0, max: 255 }),
                green: form.int({ default: 0, min: 0, max: 255 }),
                blue: form.int({ default: 0, min: 0, max: 255 }),
            }),
        }),
    }),
    run: async (flow, p) => {
        const graph = flow.nodes
        let height = p.H
        let width = p.W
        if (p.flip) {
            height = p.W
            width = p.H
        }

        // --------------------------------------------------

        const seasons = ['spring', 'summer', 'autumn', 'winter'] as const

        const themeFor = { spring: p.theme1, summer: p.theme2, autumn: p.theme3, winter: p.theme4 }

        // --------------------------------------------------
        console.log(`width : ${width}`)
        console.log(`heightd : ${height}`)

        const diagonal = Math.sqrt(width * width + height * height)
        const diagonal_correct = diagonal + (16 - (diagonal % 16))

        console.log(`diagonal : ${diagonal}`)
        console.log(`diagonal_correct : ${diagonal_correct}`)

        function MakeGradient(stops_total: number = 5): {
            gen_Grad: Image_Generate_Gradient
            width_grad: number
            height_grad: number
            width_diff: number
            height_diff: number
            rotate: number
        } {
            const ratio = Math.max(height / width, width / height)
            // const ratio_diagonal = Math.max(diagonal_correct / width, diagonal_correct / height)
            let rotate = Math.floor(Math.random() * 360)
            let angle = (rotate / 180) * Math.PI
            let cos = Math.cos(angle)
            let sin = Math.sin(angle)
            let changer = Math.abs(cos * sin * 2) + ratio

            console.log(`changer : ${changer}`)

            let width_grad = width * changer
            let height_grad = height * changer
            let width_diff = width_grad - width
            let height_diff = height_grad - height
            let gradient_stops = ''
            let index = 0
            let place = 0
            while (index < stops_total) {
                place = place + Math.floor(Math.random() * (100 / stops_total))
                let red = Math.floor(Math.random() * 256)
                let green = Math.floor(Math.random() * 256)
                let blue = Math.floor(Math.random() * 256)
                place = Math.min(place, 100)
                gradient_stops += `${place}:${red},${green},${blue} \n`
                index++
            }
            let direction_fun: Enum_Image_Flip_mode
            if (Math.floor(Math.random() * 2) == 0) {
                direction_fun = 'horizontal'
            } else {
                direction_fun = 'vertical'
            }
            let gen_Grad = graph.Image_Generate_Gradient({
                width: width,
                height: height,
                direction: direction_fun,
                gradient_stops: gradient_stops,
            })
            return { gen_Grad, width_grad, height_grad, width_diff, height_diff, rotate }
        }

        // console.log(`ratio : ${ratio}`);
        // console.log(`width_grad : ${width_grad}`);
        // console.log(`height_grad : ${height_grad}`);

        // graph.PreviewImage({images:MakeGradient().gen_Grad})
        let index = 0

        function blender(times: number = 3) {
            let image: _IMAGE = graph.Image_Blank({ width: width, height: height, red: 0, green: 0, blue: 0 })
            let index = 0
            while (index < Math.max(times, 1)) {
                let gradiant = MakeGradient()
                image = graph.Image_Transpose({
                    image: image,
                    image_overlay: gradiant.gen_Grad,
                    rotation: gradiant.rotate,
                    width: gradiant.width_grad,
                    height: gradiant.height_grad,
                    X: -gradiant.width_diff / 2,
                    Y: -gradiant.height_diff / 2,
                })
                // graph.PreviewImage({ images: image })
                image = graph.Image_Blending_Mode({
                    image_a: gradiant.gen_Grad,
                    image_b: image,
                    mode: 'multiply',
                    blend_percentage: Math.random(),
                })
                index++
            }

            // graph.PreviewImage({images:blend})
            return image
        }

        graph.PreviewImage({ images: blender() })
        // graph.PreviewImage({ images: blender(10) })
        // graph.PreviewImage({ images: blender(5) })

        // --------------------------------------------------
        for (const season of seasons) {
            console.log(themeFor[season])
            const latent = graph.VAEEncode({ pixels: blender(5), vae: graph.CheckpointLoaderSimple({ ckpt_name: p.model }) })
            const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: p.model })
            // const latent = graph.EmptyLatentImage({ width: width, height: height, batch_size: p.batchSize })
            const image = graph.VAEDecode({
                vae: ckpt,
                samples: graph.KSampler({
                    model: ckpt,
                    seed: flow.randomSeed(),
                    latent_image: latent,
                    sampler_name: 'euler',
                    scheduler: 'karras',
                    denoise: Math.random() * 0.5 + 0.5,
                    positive: graph.CLIPTextEncode({
                        clip: ckpt,
                        text: `masterpiece, detailed, ${themeFor[season]}, ${p.positive}`,
                    }),
                    negative: graph.CLIPTextEncode({
                        clip: ckpt,
                        text: `text, low res, nsfw, nude,  chlld, loli, ${p.negative}`,
                    }),
                }),
            })
            graph.PreviewImage({ images: image })
        }

        await flow.PROMPT()
    },
})
