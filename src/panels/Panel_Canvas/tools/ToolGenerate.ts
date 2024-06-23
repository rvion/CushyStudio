import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { ICanvasTool, ToolMovePayload, ToolPressPayload } from '../utils/_ICanvasTool'

import { toastError } from '../../../csuite/utils/toasts'
import { UnifiedStep } from '../states/UnifiedStep'
import { snap } from '../utils/snap'

export class ToolGenerate implements ICanvasTool {
    id: 'generate' = 'generate'
    category: 'generate' = 'generate'
    icon: IconName = 'mdiImageArea'
    description = 'run a portion of the canvas though some draft'

    constructor(public canvas: UnifiedCanvas) {}

    onSelect(): void {
        this.canvas.activeSelection.show()
    }

    onDeselect(): void {
        this.canvas.activeSelection.hide()
    }

    onPress({ ev: e }: ToolPressPayload) {
        const canvas = this.canvas
        e.cancelBubble = true
        e.evt.preventDefault()
        e.evt.stopPropagation()
        const res = canvas.activeSelection.saveImage()
        if (res == null) return toastError('❌ FAILED to canvas.activeSelection.saveImage')
        const { image, mask } = res
        if (image && canvas.currentDraft) {
            const step = canvas.currentDraft.start({
                focusOutput: false,
                imageToStartFrom: image,
            })
            const us = new UnifiedStep(canvas, step)
            canvas.steps.push(us)
        }
    }

    onMove({ infos }: ToolMovePayload) {
        const uc = this.canvas
        const sel = uc.activeSelection
        Object.assign(sel.stableData, {
            x: snap(infos.viewPointerX - sel.stableData.width / 2, uc.snapSize),
            y: snap(infos.viewPointerY - sel.stableData.height / 2, uc.snapSize),
        })
        sel.applyStableData()
        return true
    }
}
