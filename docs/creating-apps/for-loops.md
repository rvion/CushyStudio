# For loops

CushyApps supports any kind of control flow.&#x20;

You can add for loops.

<figure><img src="../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>

```diff
diff --git a/demo-for-loops.ts b/demo-for-loops.ts
index 8a50ce3..00cc228 100644
--- a/demo-for-loops.ts
+++ b/demo-for-loops.ts
@@ -7,23 +7,46 @@ app({
         model: form.enum.Enum_CheckpointLoaderSimple_ckpt_name({}),
         positive: form.string({ default: 'masterpiece, tree' }),
         seed: form.seed({}),
+        // 1. add new UI control to display how many loops you want
+        loops: form.number({ default: 3 }),
     }),
     run: async (run, ui) => {
         const workflow = run.workflow
         const graph = workflow.builder
 
         const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: ui.model })
+        // 2. here, I'm using the _LATENT annotation to allow to assign any node
+        // that produce a latent, and not just an EmptyLatentImage node.
         let latent: _LATENT = graph.EmptyLatentImage({})
 
+        // 3. moving embeddigns node definition outside of the Ksampler,
+        // as variable, so they can be used in the loop below
+        const pos = graph.CLIPTextEncode({ clip: ckpt, text: ui.positive })
+        const neg = graph.CLIPTextEncode({ clip: ckpt, text: '' })
         latent = graph.KSampler({
             seed: ui.seed,
             latent_image: latent,
             model: ckpt,
             sampler_name: 'ddim',
             scheduler: 'karras',
-            positive: graph.CLIPTextEncode({ clip: ckpt, text: ui.positive }),
-            negative: graph.CLIPTextEncode({ clip: ckpt, text: '' }),
+            positive: pos, // use the variables
+            negative: neg, // use the variables
         })
+
+        // 4. add a for loop
+        for (let i = 0; i < ui.loops; i++) {
+            // 👇 I'm reassigning latent variable
+            latent = graph.KSampler({
+                seed: ui.seed,
+                latent_image: latent, // 👈 from the previous latent
+                model: ckpt,
+                sampler_name: 'ddim',
+                scheduler: 'karras',
+                positive: pos,
+                negative: neg,
+            })
+        }
+
         const image = graph.VAEDecode({
             samples: latent,
             vae: ckpt,

```
