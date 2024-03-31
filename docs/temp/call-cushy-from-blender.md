# Calling Cushy from external apps (blender, ...)

CushyStudio comes with a built-in public API + webserver.
You you can call your app/drafts from anywhere, including Blender.
You can retrieve your images from everywhere.

## Starting a Draft Programmatically

base url: [http://localhost:8788]([http://localhost:EXPRESS_PORT](http://localhost:8788))

```sh
curl "http://localhost:8688/execute?draftID=NENZUZsmF-9Li_kiUJkei"
```

```json
{
    "uid": "req-1711918138528+0.4736738370675364",
    "success": true,
    "result": { "type": "success" },
    "imageURLs": [
        "file:///Users/loco/dev/CushyStudio/outputs/2024-3-31/22h48-58/ComfyUI_03286_.png.webp?hash=f5a4c88100096c4b2bb8dd7af607807d44a256a3"
    ],
    "imageDataURL": [
        "data:image/webp;base64,UklGRlbIAQBXRUJQVlA4WAoAAAAg....AAAA=="
    ]
}

```

## Finding your draft ID

You can easilly **find** and **copy** your draft ID via the draft action menu

![](https://cushy.fra1.cdn.digitaloceanspaces.com/rvion/70622f272cd4ab97f781c80107875f83163088e3.jpg)
