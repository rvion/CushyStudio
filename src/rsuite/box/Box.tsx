import type { ForwardedRef } from 'react'

import { observer } from 'mobx-react-lite'

import { BoxUIProps } from './BoxUIProps'
import { CurrentStyleCtx } from './CurrentStyleCtx'
import { useColor } from './useColor'

// 🔴 2024-05-20 rvion:
// || do we want to add observer here + forward ref ?
// || or just go for speed ?
export const Box = observer(
    function BoxUI_(p: BoxUIProps, ref: ForwardedRef<HTMLDivElement>) {
        const {
            // to merge:
            style,
            className,
            // to ignore:
            base,
            hover,
            text,
            shadow,
            border,
            // others:
            ...rest
        } = p
        const { background, textForCtx, variables } = useColor(p)

        return (
            <div //
                {...rest}
                ref={ref}
                tw={[className, 'Box']}
                style={{ /* ...styles, */ ...style, ...variables }}
            >
                <CurrentStyleCtx.Provider
                    value={{
                        background,
                        text: textForCtx,
                    }}
                >
                    {/* <div>{JSON.stringify(background)}</div> */}
                    {/* <div>
                        text: {JSON.stringify(text)} ({JSON.stringify(p.text)})
                    </div> */}
                    {p.children}
                </CurrentStyleCtx.Provider>
            </div>
        )
    },
    { forwardRef: true },
)
