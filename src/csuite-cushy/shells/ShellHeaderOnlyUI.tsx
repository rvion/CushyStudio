import type { RenderPropsCompiled } from '../presenters/RenderPropsCompiled'

import { fieldActionMenu } from '../../csuite/form/fieldActionMenu'
import { useProvenance } from '../../csuite/provenance/Provenance'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { renderFCOrNodeWithWrapper } from '../../csuite/utils/renderFCOrNode'

// HEADER ONLY

export const ShellHeaderOnlyUI = obs(function ShellHeaderOnlyUI(p: RenderPropsCompiled) {
   const field = p.field
   const provenance = useProvenance()
   // return <>{renderFCOrNode(p.Header, p)}</>
   return (
      <RevealUI
         tw='w-full'
         trigger={'rightClick'}
         relativeTo='mouse'
         hideTriggers={{ backdropClick: true, escapeKey: true, blurAnchor: true, clickAnchor: true }}
         content={() => <fieldActionMenu.MenuEntriesUI field={p.field} provenance={provenance} />}
      >
         {renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
            className: p.classNameAroundBodyAndHeader ?? undefined,
            field,
         })}
      </RevealUI>
   )
})
