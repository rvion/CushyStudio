// import { observer } from 'mobx-react-lite'
// import { Modal } from '../rsuite/shims'

// export const ImportWindowUI = observer(function ImportWindowUI_(p: {}) {
//     const workspace = useWorkspace()

//     const isDraggingFile = workspace.cushy.isDraggigFile
//     const hasFilesIfnImportQueue = workspace.importQueue.length > 0

//     // 1. show popup when dragging file
//     if (isDraggingFile || hasFilesIfnImportQueue)
//         return (
//             <Modal open={true}>
//                 <Modal.Header>
//                     <Modal.Title>Import Helper</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {isDraggingFile ? <DropFileIndicatorUI /> : null}
//                     {hasFilesIfnImportQueue ? <ImportCandidateListUI /> : null}
//                 </Modal.Body>
//             </Modal>
//         )

//     return null
// })
