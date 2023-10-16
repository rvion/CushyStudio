import React, { useRef, useState } from 'react'

export const ScribbleCanvas = (p: { onChange: (base64: string) => void }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [drawing, setDrawing] = useState(false)
    const [canvasWidth, setCanvasWidth] = useState(400)
    const [canvasHeight, setCanvasHeight] = useState(400)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        setDrawing(true)
        setPosition({
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
        })
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (!drawing) return

        const ctx = canvasRef.current?.getContext('2d')
        if (ctx) {
            ctx.lineWidth = 5
            ctx.lineCap = 'round'
            ctx.strokeStyle = 'black'

            ctx.beginPath()
            ctx.moveTo(position.x, position.y)
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
            ctx.stroke()

            setPosition({
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY,
            })
        }
        const base64 = canvasRef.current?.toDataURL('image/png')
        if (base64 == null) return
        p.onChange(base64.slice('data:image/png;base64,'.length))
    }

    const handleMouseUp = () => {
        setDrawing(false)
    }

    return (
        <div>
            <label>
                Width:
                <input type='number' value={canvasWidth} onChange={(e) => setCanvasWidth(Number(e.target.value))} />
            </label>
            <label>
                Height:
                <input type='number' value={canvasHeight} onChange={(e) => setCanvasHeight(Number(e.target.value))} />
            </label>
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ border: '1px solid black', display: 'block', marginTop: '10px', background: 'gray' }}
            ></canvas>
        </div>
    )
}
