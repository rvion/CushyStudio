import React, { useRef, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { makeAutoObservable } from 'mobx'
import { Button } from 'rsuite'

class ImageStore {
    image: HTMLImageElement | null = null

    constructor() {
        makeAutoObservable(this)
    }

    setImage(image: HTMLImageElement) {
        this.image = image
    }
}

const imageStore = new ImageStore()

const WebviewPlacePoints = observer(
    (props: { url: string; get: () => boolean; set: (v: { points: string; labels: string }) => void }) => {
        const { url, get, set } = props

        console.log(url)
        const [isImageLoaded, setIsImageLoaded] = useState(false)
        const [positivePoints, setPositivePoints] = useState<Array<{ x: number; y: number }>>([])
        const [negativePoints, setNegativePoints] = useState<Array<{ x: number; y: number }>>([])
        const [parameters, setParameters] = useState<any>({ labels: '', points: '' })
        const canvasRef = useRef<HTMLCanvasElement>(null)
        const containerRef = useRef<HTMLDivElement>(null)

        const formatPointsAndLabels = useCallback(() => {
            const pointsArray = [...positivePoints, ...negativePoints]
            const pointsString = pointsArray.map((point) => `[${point.x}, ${point.y}]`).join(', ')

            const labelsArray = positivePoints.map(() => 1).concat(negativePoints.map(() => 0))
            const labelsString = `[${labelsArray.join(', ')}]`

            const parameters = {
                points: pointsString,
                labels: labelsString,
            }

            // You can now use the 'parameters' object
            console.log(parameters)
            setParameters(parameters)
        }, [positivePoints, negativePoints])

        useEffect(() => {
            formatPointsAndLabels()
        }, [positivePoints, negativePoints, formatPointsAndLabels])

        const drawPoints = useCallback(() => {
            const canvas = canvasRef.current
            if (canvas && imageStore.image && isImageLoaded) {
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    ctx.drawImage(imageStore.image, 0, 0, canvas.width, canvas.height)

                    ctx.fillStyle = 'red'
                    positivePoints.forEach((point) => {
                        ctx.beginPath()
                        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
                        ctx.fill()
                    })

                    ctx.fillStyle = 'blue'
                    negativePoints.forEach((point) => {
                        ctx.beginPath()
                        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
                        ctx.fill()
                    })
                }
            }
        }, [positivePoints, negativePoints, isImageLoaded])

        const handleClick = useCallback(
            (e: React.MouseEvent<HTMLCanvasElement>) => {
                e.preventDefault()
                const canvas = canvasRef.current
                if (canvas && imageStore.image && isImageLoaded) {
                    const rect = canvas.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const point = { x, y }

                    if (e.button === 0) {
                        setPositivePoints((prevPoints) => [...prevPoints, point])
                    } else if (e.button === 2) {
                        setNegativePoints((prevBluePoints) => [...prevBluePoints, point])
                    }
                }
            },
            [isImageLoaded],
        )

        useEffect(() => {
            drawPoints()
        }, [positivePoints, drawPoints])
        useEffect(() => {
            drawPoints()
        }, [negativePoints, drawPoints])

        const handleImageLoad = useCallback(() => {
            const img = new Image()
            img.src = url
            img.onload = () => {
                const canvas = canvasRef.current
                if (canvas) {
                    canvas.width = img.width
                    canvas.height = img.height
                    imageStore.setImage(img)
                    setIsImageLoaded(true)
                }
            }
        }, [url])

        useEffect(() => {
            handleImageLoad()
        }, [handleImageLoad])

        return (
            <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
                <canvas ref={canvasRef} onMouseDown={handleClick} onContextMenu={(e) => e.preventDefault()} />
                <Button
                    onClick={() => {
                        console.log('Returning SAM parameters:')
                        console.log(parameters)
                        set(parameters)
                    }}
                >
                    Done
                </Button>
            </div>
        )
    },
)

export default WebviewPlacePoints
