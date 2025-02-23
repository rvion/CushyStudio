// https://fonts.google.com/icons

import { IconUI } from './IconUI'

export const FolderIcon = (p: { isOpen?: boolean }): React.JSX.Element =>
   p.isOpen ? ( //
      <IconUI icon={IKONS.expand_more} color='e8a87c' />
   ) : (
      <IconUI icon={IKONS.chevron_right} color='e8a87c' />
   )

export const FileIcon = (p: { filename: string }): React.JSX.Element | null => {
   const filename = p.filename
   const extension = filename.slice(filename.lastIndexOf('.') + 1)
   // prettier-ignore
   switch (extension) {
        case 'js': return <IconUI icon={IKONS.Javascript} color='yellow' />
        case 'css': return <IconUI icon='css3' color='turquoise' />
        case 'json': return <IconUI icon={IKONS.list} color='yellow' />
        case 'npmignore': return <IconUI icon={IKONS.npm} color='red' />
        default: return null
    }
}
