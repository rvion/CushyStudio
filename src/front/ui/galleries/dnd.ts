import type { ImageL } from 'src/models/Image'

import { ItemTypes } from './DnDItemTypes'
import { useDrag, useDrop } from 'react-dnd'
import { CSSProperties } from 'react'

export const useImageDrag = (image: ImageL) =>
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

export const useImageDrop = (fn: (image: ImageL) => void) =>
    useDrop<{ image: ImageL }, void, CSSProperties>(() => ({
        accept: ItemTypes.Image,
        collect(monitor) {
            return { outline: monitor.isOver() ? '1px solid gold' : undefined }
        },
        drop(item: { image: ImageL }, monitor) {
            console.log('AAAA')
            return fn(item.image)
            // item.image.update({ folderID: p.folder.id })
        },
    }))
