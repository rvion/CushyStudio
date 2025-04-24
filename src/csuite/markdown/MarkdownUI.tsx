import { marked, type MarkedOptions } from 'marked'

export const MarkdownUI = obs(function MarkdownUI_(p: {
   //
   className?: string
   markdown?: string
   opts?: MarkedOptions
}) {
   if (p.markdown == null) return null

   return (
      <div //
         tw='_MD'
         className={p.className}
         dangerouslySetInnerHTML={{ __html: marked(p.markdown, { ...p.opts, async: false }) }}
      />
   )
})
