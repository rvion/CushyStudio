import { commandManager } from '../commands/CommandManager'
import { Frame } from '../frame/Frame'

export const DebugInputHistoryUI = obs(function DebugInputHistoryUI_(p: {}) {
   return (
      <Frame tw='flex gap-0.5'>
         {commandManager.inputHistory.slice(-3).map((text, _) => {
            return (
               <Frame //
                  key={`${text}-${_}`}
                  tw='px-2'
                  roundness={cushy.preferences.theme.zValue.global.roundness}
                  base={{ contrast: -0.075 }}
               >
                  {text}
               </Frame>
            )
         })}
      </Frame>
   )
})
