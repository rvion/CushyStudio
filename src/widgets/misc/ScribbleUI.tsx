// @ts-ignore
import debounce from 'lodash.debounce'
import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'

import { FieldAndLabelUI } from './FieldAndLabelUI'
import { Button, Input, Slider } from 'src/rsuite/shims'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'

export const ScribbleCanvas = (p: {
    fillStyle: string
    strokeStyle: string
    onChange: (base64: string) => void
    style?: CSSProperties
    className?: string
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
        <div style={p.style} className={p.className}>
            <div tw='flex gap-2 items-start'>
                <Button
                    size='sm'
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
                <FieldAndLabelUI label='Weight'>
                    <Input
                        tw='input-xs'
                        style={{
                            fontFamily: 'monospace',
                            width: canvasWidth.toString().length + 7 + 'ch',
                        }}
                        type='number'
                        value={canvasWidth}
                        onChange={(ev) => setCanvasWidth(parseFloatNoRoundingErr(ev.target.value))}
                    />
                </FieldAndLabelUI>
                <FieldAndLabelUI label='Height'>
                    <Input
                        tw='input-xs'
                        style={{
                            fontFamily: 'monospace',
                            width: canvasHeight.toString().length + 7 + 'ch',
                        }}
                        type='number'
                        value={canvasHeight}
                        onChange={(ev) => setCanvasHeight(parseFloatNoRoundingErr(ev.target.value))}
                    />
                </FieldAndLabelUI>
                <FieldAndLabelUI label='Scale'>
                    <Slider
                        step={0.1}
                        min={0.5}
                        max={2}
                        style={{ width: '8rem' }}
                        value={canvasScale}
                        onChange={(ev) => setCanvasScale(parseFloatNoRoundingErr(ev.target.value))}
                    />
                </FieldAndLabelUI>
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
