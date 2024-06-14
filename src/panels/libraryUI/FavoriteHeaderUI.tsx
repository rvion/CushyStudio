// import { observer } from 'mobx-react-lite'
// import { useSt } from '../../state/stateContext'
// import { PkgHeaderStyle } from './AppListStyles'

// export const FavoriteHeaderUI = observer(function FavoriteHeaderUI_(p: {}) {
//     const library = useSt().library
//     return (
//         <div
//             tw={[
//                 //
//                 PkgHeaderStyle,
//                 'cursor-pointer items-center gap-1 flex justify-between',
//             ]}
//             onClick={() => (library.favoritesFolded = !library.favoritesFolded)}
//         >
//             <div>
//                 <span
//                     //
//                     style={{ fontSize: '2rem' }}
//                     tw='text-yellow-500'
//                     className='material-symbols-outlined'
//                 >
//                     star
//                 </span>
//             </div>
//             <div tw='flex-1'>Favorites</div>
//             <label className='swap swap-rotate opacity-30'>
//                 <input
//                     type='checkbox'
//                     checked={library.favoritesFolded}
//                     onChange={(ev) => {
//                         library.favoritesFolded = !ev.target.checked
//                     }}
//                 />
//                 <span className='material-symbols-outlined swap-on'>keyboard_arrow_right</span>
//                 <span className='material-symbols-outlined swap-off'>keyboard_arrow_down</span>
//             </label>
//         </div>
//     )
// })
