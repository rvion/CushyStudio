import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { createRef, useMemo } from 'react'

import { Button } from 'src/rsuite/shims'

type Pos2d = { x: number; y: number }

export const WidgetPlacePoints = observer(function WebviewPlacePoints_(p: {
    url: string
    get: () => { points: string; labels: string }
    set: (v: { points: string; labels: string }) => void
}) {
    const x = useMemo(() => new ImageAnnotations(p.url), [p.url])

    return (
        <div>
            {p.url}
            <canvas onClick={x.onClick} ref={x.canvasRef} />
            <Button onClick={() => p.set(x.output)}>Done</Button>
        </div>
    )
})

class ImageAnnotations {
    constructor(
        //
        public imageUrl: string,
    ) {
        makeAutoObservable(this)
        this.image = new Image()
        this.image.onload = () => {
            this.imageLoaded = true
            this.draw()
        }
        this.image.src = imageUrl
    }

    canvasRef = createRef<HTMLCanvasElement>()

    image: HTMLImageElement | null = null
    imageLoaded = false

    positivePoints: Pos2d[] = []
    negativePoints: Pos2d[] = []

    get output() {
        const pointsArray = [...this.positivePoints, ...this.negativePoints]
        const pointsString = pointsArray.map((point) => `[${point.x}, ${point.y}]`).join('; ')

        const labelsArray = this.positivePoints.map(() => 1).concat(this.negativePoints.map(() => 0))
        const labelsString = `[${labelsArray.join(', ')}]`

        return { points: pointsString, labels: labelsString }
    }
    resizeCanvas = () => {}

    onClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        e.preventDefault()
        const arr = e.shiftKey ? this.positivePoints : this.negativePoints
        const rect = (e.target as Element).getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        arr.push({ x, y })
        this.draw()
    }

    draw = () => {
        const canvas = this.canvasRef.current
        if (!canvas) return
        const context = canvas.getContext('2d')
        if (!context) return
        if (this.image == null) return
        if (!this.imageLoaded) return

        canvas.width = this.image.naturalWidth
        canvas.height = this.image.naturalHeight
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.drawImage(this.image, 0, 0)
        this.positivePoints.forEach(({ x, y }) => {
            context.beginPath()
            context.arc(x, y, 5, 0, 2 * Math.PI, false)
            context.fillStyle = 'red'
            context.fill()
        })
        this.negativePoints.forEach(({ x, y }) => {
            context.beginPath()
            context.arc(x, y, 5, 0, 2 * Math.PI, false)
            context.fillStyle = 'blue'
            context.fill()
        })
    }
}
