import { ui_startImage } from './_shared/_prefab'

app({
   ui: (b) =>
      b.fields({
         a: ui_startImage(b),
         b: ui_startImage(b),
         c: b.int({ default: 1 }),
      }),
   run: async (flow, p) => {
      flow.output_text(`startImage: ${p.a.startImage}`)
      flow.output_text(`startImage: ${p.b.startImage}`)
   },
})
