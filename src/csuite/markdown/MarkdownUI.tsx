import { marked } from 'marked'

export const MarkdownUI = obs(function MarkdownUI_(p: {
   //
   className?: string
   markdown?: string
}) {
   if (p.markdown == null) return null

   return (
      <div //
         tw='_MD'
         className={p.className}
         dangerouslySetInnerHTML={{ __html: marked(p.markdown) }}
      />
   )
})
