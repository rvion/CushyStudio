export const MenuPaneUI = obs(function MenuPaneUI_(p: { children: React.ReactNode; title: string }) {
   return (
      <div className='menuPane'>
         <div className='menuPaneTitle'>{p.title}</div>
         <div className='menuPaneContent'>{p.children}</div>
      </div>
   )
})
