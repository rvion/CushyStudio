---
description: >-
  CushyApps can be started form both context menu. this page shows how your
  custom app can support that
---

# Contextual Apps

Contextual apps allow you start any app (workflow) from an existing image ( [image-comtext-menu.md](../../getting-started/cushy-interface/image-comtext-menu.md "mention")) or selection ([unified-canvas](../../getting-started/unified-canvas/ "mention"))

## Make your app compatible

1. Add canStartFromImage

```typescript
app({
   ...
   canStartFromImage: true,
})
```

2. update  your `run` handler to take a third param

```typescript
    //                  👇👇👇👇👇
    run: async (run, ui, startImg) => {
```

## Add new entries to the image context menu

once your **CushyApp** is _start-from-image_ enabled, you can just create new drafts of your app.

Every draft will show as a new menu entry

## Support both beeing run as context action or standalone

Supporting both is easy.

```typescript
    run: async (run, ui, startImg) => {
        //  if  startImg is null, it will take ui.startImage instead
        let img = startImg ?? ui.startImage
    }
```

## Built-in examples to look at

look at the `library/quick-actions/*`

* library/built-in/quick-actions/quick-dispace.ts
* library/built-in/quick-actions/quick-refine.ts
* ...

