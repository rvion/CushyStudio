---
description: CushyApps supports any kind of control flow. This page show how to do so
---

# For loops

{% hint style="success" %}
Key learnings:

* [x] You can add for loops in your apps to repeat various set of nodes.
* [x] Using `let latent: _LATENT = ...`  is a great way to allow to cary a "Latent" signal
{% endhint %}

## Objective&#x20;

Start from the default app, and enhance it to allow for a configurable number of recursive samplers.

1. Add a new number input to control how many ksampler we want
2. Use that number to genearte

<div data-full-width="true">

<figure><img src="../.gitbook/assets/image (2) (1) (1).png" alt=""><figcaption></figcaption></figure>

</div>

<details>

<summary>Final Code</summary>

```typescript
app({
    metadata: { name: 'demo for-loops', description: 'my app description' },
    ui: (form) => ({
        model: form.enum.Enum_CheckpointLoaderSimple_ckpt_name({}),
        positive: form.string({ default: 'masterpiece, tree' }),
        seed: form.seed({}),
        // 1. add new UI control to display how many loops you want
        loops: form.number({ default: 3 }),
    }),
    run: async (run, ui) => {
        const workflow = run.workflow
        const graph = workflow.builder

        const ckpt = graph.CheckpointLoaderSimple({ ckpt_name: ui.model })
        // 2. here, I'm using the _LATENT annotation to allow to assign any node
        // that produce a latent, and not just an EmptyLatentImage node.
        let latent: _LATENT = graph.EmptyLatentImage({})

        // 3. moving embeddigns node definition outside of the Ksampler,
        // as variable, so they can be used in the loop below
        const pos = graph.CLIPTextEncode({ clip: ckpt, text: ui.positive })
        const neg = graph.CLIPTextEncode({ clip: ckpt, text: '' })
        latent = graph.KSampler({
            seed: ui.seed,
            latent_image: latent,
            model: ckpt,
            sampler_name: 'ddim',
            scheduler: 'karras',
            positive: pos, // use the variables
            negative: neg, // use the variables
        })

        // 4. add a for loop
        for (let i = 0; i < ui.loops; i++) {
            // 👇 I'm reassigning latent variable
            latent = graph.KSampler({
                seed: ui.seed,
                latent_image: latent, // 👈 from the previous latent
                model: ckpt,
                sampler_name: 'ddim',
                scheduler: 'karras',
                positive: pos,
                negative: neg,
            })
        }

        const image = graph.VAEDecode({
            samples: latent,
            vae: ckpt,
        })
        graph.PreviewImage({ images: image })
        await workflow.sendPromptAndWaitUntilDone()
    },
})
```

</details>

## Diff

```diff
app({
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
