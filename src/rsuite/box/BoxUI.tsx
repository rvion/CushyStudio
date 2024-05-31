import { Frame } from '../frame/Frame'

// 🔴 2024-05-20 rvion:
// || do we want to add observer here + forward ref ?
// || or just go for speed ?
export const BoxUI = Frame
//     function BoxUI_(p: BoxUIProps, ref: ForwardedRef<HTMLDivElement>) {
//         const {
//             // to merge:
//             style,
//             className,

//             // to ignore:
//             base,
//             hover,
//             text,
//             shadow,
//             border,

//             // others:
//             ...rest
//         } = p
//         // const { background, textForCtx, variables } = useColor(p)
//         const normalized = extractNormalizeBox(p)
//         const prevCtx = useContext(CurrentStyleCtx)
//         const nextCtx = applyBoxToCtx(prevCtx, normalized)
//         const y = compileBoxClassName(normalized)
//         const variables: { [key: string]: string | number } = {
//             '--DIR': nextCtx.dir?.toString(), // === -1 ? -1 : 1,
//             '--PREV_BASE_L': prevCtx.base.lightness, // === -1 ? -1 : 1,
//             '--NEXT_BASE_L': nextCtx.base.lightness, // === -1 ? -1 : 1,
//         }

//         const hasNewBG =
//             nextCtx.base.chroma !== prevCtx.base.chroma ||
//             nextCtx.base.lightness !== prevCtx.base.lightness ||
//             nextCtx.base.hue !== prevCtx.base.hue
//         if (hasNewBG) variables['--BASEOK'] = formatOKLCH(nextCtx.base)

//         // const hasNewDir = prevCtx
//         // if (hasNewBG) variables['--BASEOK'] = formatOKLCH(nextCtx.background)

//         return (
//             <div //
//                 {...rest}
//                 ref={ref}
//                 tw={[className, 'BBOX', y.className]}
//                 style={{ ...style, ...variables }}
//             >
//                 <CurrentStyleCtx.Provider value={nextCtx}>
//                     {/*  */}
//                     {p.children}
//                 </CurrentStyleCtx.Provider>
//             </div>
//         )
//     },
//     { forwardRef: true },
// )
