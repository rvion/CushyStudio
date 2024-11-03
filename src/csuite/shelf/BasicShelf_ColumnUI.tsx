import { observer } from 'mobx-react-lite'

export const BasicShelf_ColumnUI: React.FC<React.HTMLAttributes<HTMLDivElement>> = observer(
   function BasicShelf_Column(p) {
      return <div tw='gap flex flex-col p-2' {...p}></div>
   },
)
