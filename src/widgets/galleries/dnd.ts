import type { MediaImageL } from 'src/models/MediaImage'
import type { STATE } from 'src/state/state'

import { CSSProperties } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

import { ItemTypes } from './DnDItemTypes'
import { createMediaImage_fromFileObject } from 'src/models/createMediaImage_fromWebFile'

export const useImageDrag = (image: MediaImageL) =>
    useDrag(
        () => ({
            type: ItemTypes.Image,
            item: { image },
            collect: (monitor) => {
                // console.log('monitor.isDragging()=', monitor.isDragging())
                return { opacity: monitor.isDragging() ? 0.5 : 1 }
            },
        }),
        [image],
    )

// export const useImageDrop = (fn: (image: ImageL) => void) =>
//     useDrop<{ image: ImageL }, void, CSSProperties>(() => ({
//         accept: ItemTypes.Image,
//         collect(monitor) {
//             return { outline: monitor.isOver() ? '1px solid gold' : undefined }
//         },
//         drop(item: { image: ImageL }, monitor) {
//             console.log('AAAA')
//             return fn(item.image)
//             // item.image.update({ folderID: p.folder.id })
//         },
//     }))

type Drop1 = { image: MediaImageL }
type Drop2 = { files: (File & { path: AbsolutePath })[] }

export const useImageDrop = (st: STATE, fn: (image: MediaImageL) => void) =>
    useDrop<Drop1 | Drop2, void, CSSProperties>(() => ({
        // 1. Accepts both custom Image and native files drops.
        accept: [
            //
            ItemTypes.Image,
            NativeTypes.FILE,
        ],

        // 2. add golden border when hovering over
        collect(monitor) {
            return { outline: monitor.isOver() ? '1px solid gold' : undefined }
        },

        // 3. import as ImageL if needed
        drop(item: Drop1 | Drop2, monitor) {
            if (monitor.getItemType() == ItemTypes.Image) {
                const image: MediaImageL = (item as Drop1).image
                return fn(image)
            }
            if (monitor.getItemType() === NativeTypes.FILE) {
                // Handle file drop
                // const item = monitor.getItem() as any as Drop2
                // debugger
                const files = (item as Drop2).files
                const imageFile = Array.from(files).find((file) => file.type.startsWith('image/'))
                console.log('[🗳️] drop box: image path is', imageFile?.path ?? '❌')
                if (imageFile) {
                    console.log(`[🌠] importing native file...`)
                    void createMediaImage_fromFileObject(st, imageFile).then(fn)
                } else {
                    console.log('Dropped non-image file')
                    return
                }
            }

            throw new Error('Unknown drop type')
            // console.log('AAAA')
            // item.image.update({ folderID: p.folder.id })
        },
    }))
