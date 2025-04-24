import type { WidgetPromptUISt } from '../WidgetPromptUISt'

export const Plugin_DebugAST = obs(function Plugin_DebugAST_(p: {
   //
   uist: WidgetPromptUISt
}) {
   const uist = p.uist
   return (
      <div>
         <pre tw='whitespace-pre-wrap text-xs'>{uist.debugView}</pre>
      </div>
   )
})
