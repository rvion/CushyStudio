import type { CompiledRenderProps } from '../presenters/Renderer'

import { observer } from 'mobx-react-lite'

// SHELL SIMPLE
export const ShellInputOnly = observer(function ShellInputOnly(p: CompiledRenderProps) {
    const field = p.field
    const utils = p.presenter.utils
    return (
        <div tw='row'>
            {utils.renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
                className: p.classNameAroundBodyAndHeader ?? undefined,
                field,
            })}
        </div>
    )
    // return (
    //     <div>
    //         <div tw='row'>
    //             {utils.renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
    //                 className: p.classNameAroundBodyAndHeader ?? undefined,
    //                 field,
    //             })}
    //         </div>
    //         {utils.renderFCOrNodeWithWrapper(p.Body, p, p.ContainerForBody, {
    //             className: p.classNameAroundBodyAndHeader ?? undefined,
    //         })}
    //     </div>
    // )
})
