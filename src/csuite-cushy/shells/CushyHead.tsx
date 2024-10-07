import type { CompiledRenderProps } from '../presenters/Presenter'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { WidgetHeaderContainerUI } from '../../csuite/form/WidgetHeaderContainerUI'

export type CushyHeadProps = CompiledRenderProps & { children?: ReactNode }

export const CushyHeadUI = observer(function CushyHead(p: CushyHeadProps) {
    const field = p.field
    const utils = p.presenter.utils
    const interfacePreferences = cushy.preferences.interface.value

    return (
        <WidgetHeaderContainerUI field={field} /* border={'red'} */>
            {/* HEADER LABEL */}
            {p.children}

            {/* HEADER CONTROLS */}
            {utils.renderFCOrNodeWithWrapper(p.Header, p, p.ContainerForHeader, {
                className: p.classNameAroundBodyAndHeader ?? undefined,
                field,
            })}

            {utils.renderFCOrNode(p.UpDownBtn, {})}
            {utils.renderFCOrNode(p.DeleteBtn, {})}

            {/* HEADER EXTRA prettier-ignore */}
            {utils.renderFCOrNode(p.Extra, p)}
            {interfacePreferences.showWidgetUndo && utils.renderFCOrNode(p.UndoBtn, p)}
            {interfacePreferences.showWidgetMenu && utils.renderFCOrNode(p.MenuBtn, p)}
        </WidgetHeaderContainerUI>
    )
})
