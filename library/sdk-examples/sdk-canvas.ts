app({
   help: 'require WAS custom nodes for iamge filp',
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
   run: async (sdk) => {
      // create an image proceduarly
      const layer = sdk.Konva.createStageWithLayer({ width: 512, height: 512 })
      sdk.Konva.addGradientToLayer(layer, [0, 'red', 0.3 /* Math.random() */, 'pink', 1, 'yellow'])
      const dataURL = sdk.Konva.convertLayerToDataURL(layer)

      // load it in ComfyUI workflow
      const image = await sdk.Images.loadAsImage(dataURL)

      // Flip it with nodes
      sdk.nodes['was.Image Flip']({ images: image, mode: 'vertical' })
      sdk.nodes['was.Image Flip']({ images: sdk.AUTO, mode: 'horizontal' }) // 'AUTO' matches the last IMAGE slot
      sdk.nodes.PreviewImage({ images: sdk.AUTO })
      void sdk.PROMPT()
   },
})
