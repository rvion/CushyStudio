import { observer } from 'mobx-react-lite'

export const MenuPaneUI = observer(function MenuPaneUI_(p: { children: React.ReactNode; title: string }) {
   return (
      <div className='menuPane'>
         <div className='menuPaneTitle'>{p.title}</div>
         <div className='menuPaneContent'>{p.children}</div>
      </div>
   )
})
