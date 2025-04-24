export const FieldAndLabelUI = obs(function SubtlePanelConfUI_(p: {
   label: string
   children: React.ReactNode
}) {
   return (
      <div>
         <div>{p.label}</div>
         {p.children}
      </div>
   )
})

export const FieldAndLabelInlineUI = obs(function FieldAndLabelInlineUI_(p: {
   label: string
   children: React.ReactNode
}) {
   return (
      <div tw='flex gap-1'>
         <div
            style={{
               flexShrink: 0,
               minWidth: '8rem',
               textAlign: 'right',
               width: '25%',
               marginRight: '0.25rem',
            }}
         >
            {p.label}
         </div>
         {p.children}
      </div>
   )
})
