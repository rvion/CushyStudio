import { observer } from 'mobx-react-lite'

import { useUnifiedCanvas } from '../UnifiedCanvasCtx'
import { ComboUI } from 'src/app/shortcuts/ComboUI'

export const CanvasToolbarUI = observer(function CanvasToolbarUI_(p: {}) {
    const canvas = useUnifiedCanvas()
    return (
        <div tw='flex items-center'>
            <div onClick={() => canvas.enable_generate()} tw={['btn btn-xs', canvas.tool === 'generate' ? 'btn-primary' : null]}>
                Generate
                <ComboUI combo='1' />
            </div>
            <div onClick={() => canvas.enable_mask()} tw={['btn btn-xs', canvas.tool === 'mask' ? 'btn-primary' : null]}>
                Mask
                <ComboUI combo='2' />
            </div>
            <div onClick={() => canvas.enable_paint()} tw={['btn btn-xs', canvas.tool === 'paint' ? 'btn-primary' : null]}>
                Paint
                <ComboUI combo='3' />
            </div>
            <div onClick={() => canvas.enable_move()} tw={['btn btn-xs', canvas.tool === 'move' ? 'btn-primary' : null]}>
                Move
                <ComboUI combo='4' />
            </div>
        </div>
    )
})
