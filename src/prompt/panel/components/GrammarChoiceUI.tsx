import type { Prompt_Choice, Prompt_expression } from '../../grammar/grammar.practical'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../../csuite/checkbox/InputBoolUI'

export const GrammarChoiceUI = observer(function GrammarChoiceUI_(p: {
   choice: Prompt_Choice
   index: number
   nested?: boolean
}) {
   const choice = p.choice
   const index = p.index
   const nested = p.nested
   const indexAST = choice.indexAST
   const theme = cushy.preferences.theme.value

   const parent = choice.parent

   if (!nested && parent?.$kind != 'Prompt') {
      return <></>
   }

   if (indexAST == null) {
      return <>Invalid indexAST, expected `[number, "?", "_"]`</>
   }
   const active = indexAST.number != null && indexAST.number == index
   const toggleGroup = `${choice.name}_${index}`

   return (
      <UY.Layout.Col //
         tw='select-none gap-1 p-1'
         roundness={theme.global.roundness}
         key={index}
         base={{ contrast: 0.05 }}
      >
         <UY.Layout.Row tw='items-center p-1' base={{ contrast: -0.1 }}>
            <span tw='flex-1 truncate'>{choice.name ?? 'No name'}</span>
            <UY.Layout.Row tw='flex-1 !flex-shrink !flex-grow-0' align>
               <InputBoolUI
                  square
                  icon={'mdiCancel'}
                  roundness={theme.global.roundness}
                  hover
                  value={indexAST.isBypass()}
                  display='button'
                  toggleGroup={toggleGroup}
                  onValueChange={() => {
                     indexAST.setBypass()
                  }}
               />
               <InputBoolUI
                  square
                  icon={'mdiHelp'}
                  roundness={theme.global.roundness}
                  hover
                  value={indexAST.isRandom()}
                  display='button'
                  toggleGroup={toggleGroup}
                  onValueChange={() => {
                     indexAST.setRandom()
                  }}
               />
            </UY.Layout.Row>
         </UY.Layout.Row>
         <UY.Layout.Col base={{ contrast: -0.1 }} key={index} align>
            {choice.expressions &&
               choice.expressions.map((entry, index) => {
                  const selected = indexAST.number != null && indexAST.number == index
                  return (
                     <>
                        <InputBoolUI
                           tw='!line-clamp-1 !text-left'
                           roundness={theme.global.roundness}
                           value={selected}
                           display='button'
                           toggleGroup={toggleGroup}
                           onValueChange={() => {
                              indexAST.number = index
                           }}
                        >
                           {entry && formatChoice(entry, index)}
                        </InputBoolUI>
                        {entry && entry.$kind == 'Choice' && selected && (
                           <GrammarChoiceUI choice={entry} index={index} nested />
                        )}
                     </>
                  )
               })}
         </UY.Layout.Col>
      </UY.Layout.Col>
   )
})

function formatChoice(entry: Prompt_expression, index: number): JSX.Element {
   switch (entry.$kind) {
      case 'String':
         return <>{entry.text.slice(1, -1)}</>
      case 'Choice': {
         const indexAST = entry.indexAST

         if (indexAST == null) {
            return <>Invalid index AST</>
         }
         //  return <GrammarChoiceUI choice={entry} index={index} />
         return (
            <>{`?>${entry.name}[${indexAST.isBypass() ? '_' : indexAST.isRandom() ? '?' : entry.value}]`}</>
         )
      }

      default:
         return <>{entry.text}</>
   }
}
