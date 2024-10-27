import type { ComfyWorkflowJSON } from '../../core/LiteGraph'
import type { ComfyPromptJSON } from '../../types/ComfyPrompt'

import { observer } from 'mobx-react-lite'

import { convertWorkflowToPrompt } from '../../core/litegraphToPrompt'
import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { JsonViewUI } from '../../csuite/json/JsonViewUI'
import { TypescriptHighlightedCodeUI } from '../../widgets/misc/TypescriptHighlightedCodeUI'

/** Freely modify this as you like, then pick the "Scratch Pad" option in the top left. Do not commit changes made to this. */
export const PlaygroundImportFromComfy = observer(function PlaygroundImportFromComfy_(p: {}) {
   const absPath = cushy.resolveFromRoot('library/built-in/3d/3d-app-1/3d1.workflow.json' as RelativePath)
   const wflowJSON = cushy.readJSON_<ComfyWorkflowJSON>(absPath)
   const promptJSON: ComfyPromptJSON = convertWorkflowToPrompt(cushy.schema, wflowJSON)
   const code = cushy.importer.convertPromptToCode(promptJSON, { autoUI: false, preserveId: false })
   return (
      <ErrorBoundaryUI>
         <h3>play with imports</h3>
         <div tw='font-bold'>
            2024-03-26 rvion: trying to import stuff from https://github.com/MrForExample/ComfyUI-3D-Pack, got
            problems, so I crated this playground panel to improve / fix import (below:
            library/built-in/3d/3d-app-1/3d1.workflow.json)
         </div>
         <div tw='h-full overflow-auto'>
            <TypescriptHighlightedCodeUI code={code} />
            <JsonViewUI value={promptJSON} />
         </div>
      </ErrorBoundaryUI>
   )
})
