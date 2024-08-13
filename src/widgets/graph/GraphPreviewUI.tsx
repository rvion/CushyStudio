// @ts-ignore
import { autorun, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { MutableRefObject, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

import { ComfyWorkflowL } from '../../models/ComfyWorkflow'
import { DrawWorkflowUI } from './DrawWorkflowUI'
import { useCursorLockMove } from './useCursorLockMove'

// import { renderMinimap } from '../minimap/Minimap'

export const useObservableRef = <T extends any>() => useMemo(() => observable({ current: null } as MutableRefObject<T>), [])

export const GraphPreviewUI = observer(function GraphPreviewUI_(p: { graph: ComfyWorkflowL }) {
    const workflow = p.graph
    const canvasRef = useObservableRef<HTMLCanvasElement>()
    const canvas = canvasRef.current
    const { dx, dy, isDragging, props } = useCursorLockMove()
    useEffect(() => {
        if (workflow == null) /* */ return console.log('❌ no graph yet')
        if (canvas == null) /*   */ return console.log('❌ no canvas yet')
        const del = autorun(() => {
            const ctx = canvas.getContext('2d')!
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const { width, height } = workflow
            const max = 200
            canvas.width = max //width > height ? max : (width / height) * max
            canvas.height = max //height > width ? max : (height / width) * max
            canvas.style.width = `${max}px`
            canvas.style.height = `${max}px`
            const ratio = 1 / (width > height ? width / max : height / max)
            for (const x of workflow.nodes) {
                // prettier-ignore
                ctx.fillStyle =
                    x.status === 'cached'    ? 'yellow'      :
                    x.status === 'done'      ? 'lightgreen'  :
                    x.status === 'error'     ? 'red'         :
                    x.status === 'executing' ? 'pink'        :
                    x.status === 'waiting'   ? 'blue'        :
                    x.status ===  null       ? '#88888811' :
                    'purple'
                ctx.fillRect(
                    //
                    x.x * ratio,
                    x.y * ratio,
                    x.width * ratio,
                    x.height * ratio,
                )
            }
        })
        return del
    }, [workflow, canvasRef.current])

    const domNode = document.getElementById('hovered-graph')
    if (domNode == null) return '❌ domNode is null'

    /* Temporary workaround for when the overlay gets stuck so people don't have to restart. */
    const listenForCancelKey = (ev: KeyboardEvent) => {
        if (ev.key == 'Escape') {
            domNode.style.opacity = '0'
            window.removeEventListener('keydown', listenForCancelKey, true)
        }
        //
    }

    return (
        <div>
            <canvas
                id='map'
                ref={canvasRef}
                {...props}
                style={{
                    width: '100px',
                    height: '100px',
                    zIndex: 1000,
                }}
                // onMouseOverCapture={}
                onMouseEnter={() => {
                    domNode.style.opacity = '1'
                    window.addEventListener('keydown', listenForCancelKey, true)
                }}
                onMouseLeave={() => {
                    domNode.style.opacity = '0'
                    window.removeEventListener('keydown', listenForCancelKey, true)
                }}
            />
            {createPortal(
                <DrawWorkflowUI //
                    offset={isDragging ? { x: dx, y: dy } : undefined}
                    workflow={workflow}
                />,
                domNode,
            )}
        </div>
    )
})
