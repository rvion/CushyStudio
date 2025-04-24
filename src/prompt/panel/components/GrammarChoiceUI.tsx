import type { Prompt_Choice, Prompt_expression } from '../../grammar/grammar.practical'
import type { EditorView } from 'codemirror'
import type React from 'react'

import { InputBoolUI } from '../../../csuite/checkbox/InputBoolUI'

export const GrammarChoiceUI = obs(function GrammarChoiceUI_(p: {
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
   const theme = cushy.preferences.theme.zValue

   const parent = choice.parent

   if (!nested && parent?.$kind != 'Prompt') {
      return <></>
   }

   if (indexAST == null) {
      return (
         <uy.layout.Row //
            tw='select-none !gap-2 p-1'
            look='error'
            line
            key={index}
            base={{ contrast: 0.05 }}
            tooltip={
               <uy.misc.Frame tw='flex !min-w-72 text-wrap'>
                  {`Inlined Wildcards (Choices) require the index to be set, for example

?>"My Choice"[index_value]
The "index_value" would be a Number, Random "?", or Disable "_"]`}
               </uy.misc.Frame>
            }
         >
            <uy.misc.Button
               icon={IKONS.mdiFileDocumentArrowRight}
               tooltip={'Jump to error'}
               onClick={() => {
                  p.view?.dispatch({
                     selection: { anchor: choice.from },
                     scrollIntoView: true,
                  })
                  p.view?.focus()
               }}
            />
            <uy.misc.Frame>Expected Index option</uy.misc.Frame>
         </uy.layout.Row>
      )
   }
   const toggleGroup = `${choice.name}_${index}`

   return (
      <uy.layout.Col //
         tw={'relative select-none gap-0.5 p-1.5'}
         roundness={theme.global.roundness}
         key={index}
         base={{ contrast: nested ? 0.1 : 0.077 }}
      >
         {nested && (
            <uy.misc.Frame
               border={{ contrast: -0.1 }}
               tw='absolute left-0 top-0 flex h-full w-full !border-b-0 !border-l-4 !border-r-0 !border-t-0 !bg-transparent '
            />
         )}
         <uy.layout.Row tw='items-center p-1' base={{ contrast: 0 }}>
            <span tw='flex-1 truncate'>{choice.name ?? 'No name'}</span>
            <uy.layout.Row tw='flex-1 !flex-shrink !flex-grow-0' align>
               <InputBoolUI
                  square
                  icon={IKONS.mdiCancel}
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
                  icon={IKONS.mdiHelp}
                  roundness={theme.global.roundness}
                  hover
                  value={indexAST.isRandom()}
                  display='button'
                  toggleGroup={toggleGroup}
                  onValueChange={() => {
                     indexAST.setRandom()
                  }}
               />
            </uy.layout.Row>
         </uy.layout.Row>
         <uy.layout.Col base={{ contrast: -0.1 }} key={index} align>
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
         </uy.layout.Col>
      </uy.layout.Col>
   )
})

function formatChoice(view: Maybe<EditorView>, entry: Prompt_expression, index: number): React.JSX.Element {
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
            <>{`?>${entry.name ?? ''}[${indexAST.isBypass() ? '_' : indexAST.isRandom() ? '?' : entry.value}]`}</>
         )
      }

      default:
         return <>{entry.text}</>
   }
}
