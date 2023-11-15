import React, { useRef, useState, useEffect, useMemo, CSSProperties } from 'react'
import debounce from 'lodash/debounce'
import { Button, Input, Slider } from 'rsuite'

export const ScribbleCanvas = (p: {
    style: CSSProperties
    fillStyle: string
    strokeStyle: string
    onChange: (base64: string) => void
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [drawing, setDrawing] = useState(false)
    const [canvasWidth, setCanvasWidth] = useState(512)
    const [canvasHeight, setCanvasHeight] = useState(512)
    const [canvasScale, setCanvasScale] = useState(0.5)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d')
        if (ctx) {
            ctx.fillStyle = p.fillStyle
            ctx.fillRect(0, 0, canvasWidth, canvasHeight)
        }
    }, [canvasWidth, canvasHeight])

    const debouncedOnChange = useMemo(
        () =>
            debounce(() => {
                const base64 = canvasRef.current?.toDataURL('image/png')
                if (base64 == null) return
                p.onChange(base64.slice('data:image/png;base64,'.length))
            }, 250),
        [p.onChange],
    )

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        setDrawing(true)
        setPosition({
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
        })
    }

    const handleMouseUp = () => setDrawing(false)
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!drawing) return

        const ctx = canvasRef.current?.getContext('2d')
        if (ctx) {
            ctx.lineWidth = 5
            ctx.lineCap = 'round'
            ctx.strokeStyle = p.strokeStyle

            ctx.beginPath()
            ctx.moveTo(position.x, position.y)
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            ctx.stroke()

            setPosition({
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY,
            })
        }

        debouncedOnChange()
    }
    return (
        <div style={p.style}>
            <div tw='flex gap-2 items-start'>
                <Button
                    onClick={() => {
                        const ctx = canvasRef.current?.getContext('2d')
                        if (ctx) {
                            ctx.fillStyle = p.fillStyle
                            ctx.fillRect(0, 0, canvasWidth, canvasHeight)
                        }
                    }}
                >
                    reset
                </Button>
                <div>
                    Weight
                    <Input
                        size='xs'
                        style={{
                            fontFamily: 'monospace',
                            width: canvasWidth.toString().length + 7 + 'ch',
                        }}
                        type='number'
                        value={canvasWidth}
                        onChange={(e) => setCanvasWidth(Number(e))}
                    />
                </div>
                <div>
                    Height
                    <Input
                        size='xs'
                        style={{
                            fontFamily: 'monospace',
                            width: canvasHeight.toString().length + 7 + 'ch',
                        }}
                        type='number'
                        value={canvasHeight}
                        onChange={(e) => setCanvasHeight(Number(e))}
                    />
                </div>
                <div>
                    Scale
                    <Slider
                        step={0.1}
                        min={0.5}
                        max={2}
                        style={{ width: '3rem' }}
                        value={canvasScale}
                        onChange={(e) => setCanvasScale(Number(e))}
                    />
                </div>
            </div>
            <div style={{ height: `${canvasScale * canvasHeight}px` }}>
                <canvas
                    ref={canvasRef}
                    width={canvasWidth}
                    height={canvasHeight}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                        transformOrigin: 'top left',
                        transform: `scale(${canvasScale})`,
                        border: '1px solid gray',
                        display: 'block',
                        // marginTop: '10px',
                    }}
                ></canvas>
            </div>
        </div>
    )
}
