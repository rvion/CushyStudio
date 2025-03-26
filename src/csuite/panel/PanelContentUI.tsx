export const PanelContentUI = obs(function PanelContent(p: React.HTMLAttributes<HTMLDivElement>) {
   return (
      <div //
         // style={{ border: '2px solid blue' }}
         tw='flex flex-1 flex-grow flex-col overflow-auto'
         {...p}
      />
   )
})
