import type { Prompt_Choice, Prompt_expression } from '../../grammar/grammar.practical'
import type { EditorView } from 'codemirror'

import { observer } from 'mobx-react-lite'

import { InputBoolUI } from '../../../csuite/checkbox/InputBoolUI'

export const GrammarChoiceUI = observer(function GrammarChoiceUI_(p: {
   view: Maybe<EditorView>
   choice: Prompt_Choice
   index: number
   nested?: boolean
}) {
   const choice = p.choice
   const index = p.index
   const nested = p.nested
   const view = p.view
   const indexAST = choice.indexAST
   const theme = cushy.preferences.theme.value

   const parent = choice.parent

   if (!nested && parent?.$kind != 'Prompt') {
      return <></>
   }

   if (indexAST == null) {
      return (
         <UY.Layout.Row //
            tw='select-none !gap-2 p-1'
            look='error'
            line
            key={index}
            base={{ contrast: 0.05 }}
            tooltip={
               <UY.Misc.Frame tw='flex !min-w-72 text-wrap'>
                  {`Inlined Wildcards (Choices) require the index to be set, for example 

?>"My Choice"[index_value]
The "index_value" would be a Number, Random "?", or Disable "_"]`}
               </UY.Misc.Frame>
            }
         >
            <UY.Misc.Button
               icon={'mdiFileDocumentArrowRight'}
               tooltip={'Jump to error'}
               onClick={() => {
                  p.view?.dispatch({
                     selection: { anchor: choice.from },
                     scrollIntoView: true,
                  })
                  p.view?.focus()
               }}
            />
            <UY.Misc.Frame>Expected Index option</UY.Misc.Frame>
         </UY.Layout.Row>
      )
   }
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
                           {entry && formatChoice(view, entry, index)}
                        </InputBoolUI>
                        {entry && entry.$kind == 'Choice' && selected && (
                           <GrammarChoiceUI view={view} choice={entry} index={index} nested />
                        )}
                     </>
                  )
               })}
         </UY.Layout.Col>
      </UY.Layout.Col>
   )
})

function formatChoice(view: Maybe<EditorView>, entry: Prompt_expression, index: number): JSX.Element {
   switch (entry.$kind) {
      case 'String':
         return <>{entry.text.slice(1, -1)}</>
      case 'Choice': {
         const indexAST = entry.indexAST

         if (indexAST == null) {
            // entry.from
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
