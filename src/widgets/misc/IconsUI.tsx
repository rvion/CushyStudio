import { IkonOf } from '../../csuite/icons/iconHelpers'

export const FolderIcon = (p: { isOpen?: boolean }): React.JSX.Element =>
   p.isOpen ? ( //
      <IkonOf name={IKONS.mdiExpandAll} color='e8a87c' />
   ) : (
      <IkonOf name={IKONS.mdiChevronRight} color='e8a87c' />
   )

export const FileIcon = (p: { filename: string }): React.JSX.Element | null => {
   const filename = p.filename
   const extension = filename.slice(filename.lastIndexOf('.') + 1)
   // prettier-ignore
   switch (extension) {
        case 'js': return <IkonOf name={IKONS.mdiLanguageJavascript} color='yellow' />
        case 'css': return <IkonOf name={IKONS.mdiLanguageCss3} color='turquoise' />
        case 'json': return <IkonOf name={IKONS.mdiListBox} color='yellow' />
        case 'npmignore': return <IkonOf name={IKONS.mdiNpm} color='red' />
        default: return null
    }
}
