import { Dialog, DialogBody, DialogContent, DialogSurface, DialogTitle } from '@fluentui/react-components'
import { observer } from 'mobx-react-lite'
import { useWorkspace } from '../ui/WorkspaceContext'
import { DropFileIndicatorUI } from './DropFileIndicatorUI'
import { ImportCandidateListUI } from './ImportCandidateListUI'

export const ImportWindowUI = observer(function ImportWindowUI_(p: {}) {
    const workspace = useWorkspace()

    const isDraggingFile = workspace.cushy.isDraggigFile
    const hasFilesIfnImportQueue = workspace.importQueue.length > 0

    // 1. show popup when dragging file
    if (isDraggingFile || hasFilesIfnImportQueue)
        return (
            <Dialog open={true}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>Import Helper</DialogTitle>
                        <DialogContent>
                            {isDraggingFile ? <DropFileIndicatorUI /> : null}
                            {hasFilesIfnImportQueue ? <ImportCandidateListUI /> : null}
                        </DialogContent>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        )

    return null
})
