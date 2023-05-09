import React, { useRef, useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

import { makeAutoObservable } from 'mobx'
import { Button, Modal } from 'rsuite'

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

interface PointPlacementParams {
    url: string
    parameters: { points: string; labels: string }
    setParameters: (v: { points: string; labels: string }) => void
    positivePoints: Array<{ x: number; y: number }>
    setPositivePoints: (v: Array<{ x: number; y: number }>) => void
    negativePoints: Array<{ x: number; y: number }>
    setNegativePoints: (v: Array<{ x: number; y: number }>) => void
    canvasSize: { width: number; height: number }
    imageStore: ImageStore
}

const PointPlacement = observer((params: PointPlacementParams) => {
    const { url, parameters, setParameters, positivePoints, setPositivePoints, negativePoints, setNegativePoints, canvasSize } =
        params

    console.log(url)
    //const [isImageLoaded, setIsImageLoaded] = useState(false)
    //const [parameters, setParameters] = useState<any>({ labels: '', points: '' })
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const formatPointsAndLabels = useCallback(() => {
        const pointsArray = [...positivePoints, ...negativePoints]
        const pointsString = pointsArray.map((point) => `[${point.x}, ${point.y}]`).join('; ')

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
        if (canvas && imageStore.image) {
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(imageStore.image, 0, 0, canvas.width, canvas.height)

                const scaleFactor = canvas.width / imageStore.image.width

                ctx.fillStyle = 'red'
                positivePoints.forEach((point) => {
                    ctx.beginPath()
                    ctx.arc(point.x * scaleFactor, point.y * scaleFactor, 5, 0, 2 * Math.PI)
                    ctx.fill()
                })

                ctx.fillStyle = 'blue'
                negativePoints.forEach((point) => {
                    ctx.beginPath()
                    ctx.arc(point.x * scaleFactor, point.y * scaleFactor, 5, 0, 2 * Math.PI)
                    ctx.fill()
                })
            }
        }
    }, [positivePoints, negativePoints])

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            e.preventDefault()
            const canvas = canvasRef.current
            if (canvas && imageStore.image) {
                const rect = canvas.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top

                const scaleFactor = imageStore.image.width / canvas.width

                const scaledX = x * scaleFactor
                const scaledY = y * scaleFactor
                const point = { x: scaledX, y: scaledY }

                if (e.button === 0) {
                    setPositivePoints([...positivePoints, point])
                } else if (e.button === 2) {
                    setNegativePoints([...negativePoints, point])
                }
            }
        },
        [positivePoints, negativePoints],
    )

    useEffect(() => {
        drawPoints()
    }, [imageStore.image, drawPoints])
    useEffect(() => {
        drawPoints()
    }, [positivePoints, drawPoints])
    useEffect(() => {
        drawPoints()
    }, [negativePoints, drawPoints])

    useEffect(() => {
        const loadImage = async () => {
            const image = new Image()
            image.crossOrigin = 'anonymous'
            image.onload = () => {
                imageStore.setImage(image)
            }
            image.src = url
        }

        loadImage()
    }, [url])

    return (
        <div ref={containerRef} style={{ width: canvasSize.width, height: canvasSize.height }}>
            <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                onMouseDown={handleClick}
                onContextMenu={(e) => e.preventDefault()}
            />
        </div>
    )
})

const WebviewPlacePoints = observer(
    (props: {
        url: string
        get: () => { points: string; labels: string }
        set: (v: { points: string; labels: string }) => void
    }) => {
        const { url, get, set } = props

        const [showModal, setShowModal] = useState(false)
        const [parameters, setParameters] = useState({ points: '', labels: '' })
        const [positivePoints, setPositivePoints] = useState<Array<{ x: number; y: number }>>([])
        const [negativePoints, setNegativePoints] = useState<Array<{ x: number; y: number }>>([])
        const imageStore = new ImageStore()

        const updateParametersAndCallSet = (params: { points: string; labels: string }) => {
            setParameters(params)
            set(parameters)
        }

        const toggleModal = () => {
            setShowModal(!showModal)
        }

        useEffect(() => {
            const loadImage = async () => {
                const image = new Image()
                image.crossOrigin = 'anonymous'
                image.onload = () => {
                    imageStore.setImage(image)
                }
                image.src = url
            }

            loadImage()
        }, [url])

        return (
            <div style={{ width: '100%', height: '100%' }}>
                <PointPlacement
                    url={url}
                    parameters={parameters}
                    setParameters={updateParametersAndCallSet}
                    positivePoints={positivePoints}
                    setPositivePoints={setPositivePoints}
                    negativePoints={negativePoints}
                    setNegativePoints={setNegativePoints}
                    canvasSize={{ width: 512, height: 512 }}
                    imageStore={imageStore}
                />
                <Button
                    onClick={() => {
                        setPositivePoints([])
                        setNegativePoints([])
                    }}
                >
                    Reset
                </Button>
                <Button onClick={toggleModal}>Open Modal</Button>
                <Modal open={showModal} onClose={toggleModal} style={{ width: 'auto', maxWidth: '90vw', overflow: 'auto' }}>
                    <Modal.Header>
                        <Modal.Title>Place Points in Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PointPlacement
                            url={url}
                            parameters={parameters}
                            setParameters={updateParametersAndCallSet}
                            positivePoints={positivePoints}
                            setPositivePoints={setPositivePoints}
                            negativePoints={negativePoints}
                            setNegativePoints={setNegativePoints}
                            canvasSize={{ width: 1024, height: 1024 }}
                            imageStore={imageStore}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => {
                                setPositivePoints([])
                                setNegativePoints([])
                            }}
                        >
                            Reset
                        </Button>
                        <Button onClick={toggleModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    },
)

export default WebviewPlacePoints
