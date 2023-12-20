// import { observer } from 'mobx-react-lite'
// import { GitManagedFolder } from 'src/updater/updater'
// import { Button } from 'src/rsuite/shims'

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
//             appearance='primary'
//         >
//             git init
//         </Button>
//     )
// })
