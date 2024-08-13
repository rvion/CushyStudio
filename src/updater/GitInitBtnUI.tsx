// import { observer } from 'mobx-react-lite'
// import { GitManagedFolder } from './updater'
// import { Button } from '../rsuite/shims'

// export const GitInitBtnUI = observer(function GitInitBtnUI_(p: { updater: GitManagedFolder }) {
//     const updater = p.updater
//     return (
//         <Button
//             disabled={updater.currentAction != null}
//             icon={<span className='material-symbols-outlined'>track_changes</span>}
//             onClick={async () => {
//                 await updater._gitInit()
//             }}
//             size='xs'
//             look='primary'
//         >
//             git init
//         </Button>
//     )
// })
