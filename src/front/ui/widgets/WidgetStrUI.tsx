// import { observer } from 'mobx-react-lite'
// import { Input } from 'rsuite'
// import { useForm } from '../FormCtx'
// import { EditorUI } from './WidgetLexical'

// export const WidgetStrUI = observer(function WidgetStrUI_(p: {
//     //
//     get: () => string
//     set: (v: string) => void
//     nullable?: boolean
//     textarea?: boolean
// }) {
//     const form = useForm()
//     return (
//         <>
//             <EditorUI {...p} />
//             {/* <Input //
//                 onKeyDown={(e) => {
//                     if (e.key === 'Enter' && e.metaKey) {
//                         form.submit()
//                         e.preventDefault()
//                         e.stopPropagation()
//                     }
//                 }}
//                 as={p.textarea ? 'textarea' : 'input'}
//                 type='text'
//                 onChange={(e) => p.set(e)}
//                 value={p.get()}
//             /> */}
//         </>
//     )
// })
