import type { Extension } from '@codemirror/state'

import { syntaxTree } from '@codemirror/language'
import { linter } from '@codemirror/lint'

// https://discuss.codemirror.net/t/show-syntax-error-from-lezer-parse/5346
// Show syntax error from Lezer parse

export function simpleLezerLinter(): Extension {
   return linter((view) => {
      const { state } = view
      const tree = syntaxTree(state)
      if (tree.length === state.doc.length) {
         let pos: Maybe<number> = null
         tree.iterate({
            enter: (n) => {
               if (pos == null && n.type.isError) {
                  pos = n.from
                  return false
               }
            },
         })

         if (pos != null)
            return [
               {
                  from: pos,
                  to: pos + 1,
                  severity: 'error',
                  message: 'syntax error',
                  markClass: 'cm-lezer-syntax-error',
               },
            ]
      }

      return []
   })
}

/*
------------------------------------------------
Q. (How can I show all error indication from a Lezer parser?)
I’m using CodeMirror for a custom language. I’ve successfully written a Lezer grammar and have got syntax highlighting working.

I was hoping the building blocks would be provided to get in-editor indication of syntax errors from the same grammar, but it looks like not. If I’ve understood correctly, error indicators in PM come from the linter support, and there’s no automatic way to get a linter from a lezer parser.

I’ve seen mention in this forum that an LR parser may not be the best tool for the job, but surely it must be way better than nothing?!

I’m thinking it should be fairly easy to:

get highest character offset that the parser made it to without hitting a parse error,
write a very simple linter that reports that offset as an error
Any advice on how to accomplish that? Or is there a better way to go?
------------------------------------------------
A. (marijn)
This is doable, but indeed, the parser won’t give any useful error message about a parse failure.
What you’d do is write a lint source 18 that takes the current syntax tree 6,
checks if it covers 13 the whole document
(so that it doesn’t report errors for partial parses that were aborted due to running out of time),
and then iterates 6 through the tree to find the first error marker (node.type.isError 5).
*/
