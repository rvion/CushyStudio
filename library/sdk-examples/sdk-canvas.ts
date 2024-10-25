app({
   metadata: {
      name: 'sdk-canvas-demo',
      author: 'rvion',
      description: [
         //
         `sample app demonstrating how to:`,
         `- Create an image procedurally with Konva`,
         `- retrieve its to a dataURL`,
         `- Load it in ComfyUI workflow via Upload`,
         `- Flip it with nodes`,
      ].join('\n'),
   },
   ui: (b) => b.empty(),
   run: async (run) => {
      // create an image proceduarly
      const layer = run.Konva.createStageWithLayer({ width: 512, height: 512 })
      run.Konva.addGradientToLayer(layer, [0, 'red', 0.3 /* Math.random() */, 'pink', 1, 'yellow'])
      const dataURL = run.Konva.convertLayerToDataURL(layer)

      // load it in ComfyUI workflow
      const image = await run.Images.loadAsImage(dataURL)

      // Flip it with nodes
      run.nodes.Image_Flip({ images: image, mode: 'vertical' })
      run.nodes.Image_Flip({ images: run.AUTO, mode: 'horizontal' }) // 'AUTO' matches the last IMAGE slot
      run.nodes.PreviewImage({ images: run.AUTO })
      void run.PROMPT()
   },
})
