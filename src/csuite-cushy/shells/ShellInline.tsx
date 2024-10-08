import type { CompiledRenderProps } from '../presenters/Presenter'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'

// SHELL SIMPLE
export const ShellInlineUI = observer(function ShellInline(p: CompiledRenderProps) {
    const field = p.field
    const utils = p.presenter.utils
    return (
        <Frame row>
            {utils.renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
                className: p.classNameAroundBodyAndHeader ?? undefined,
                field,
            })}
            {utils.renderFCOrNodeWithWrapper(p.Body, p, p.ContainerForBody, {
                className: p.classNameAroundBodyAndHeader ?? undefined,
            })}
        </Frame>
    )
})
