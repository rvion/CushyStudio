export const SectionTitleUI = obs(function SectionTitleUI_(p: {
   children?: React.ReactNode
   className?: string
   label: React.ReactNode
}) {
   return (
      <b className={`flex ${p.className}`}>
         <div className='my-auto grow'>{p.label}</div>
         {p.children}
      </b>
   )
})
