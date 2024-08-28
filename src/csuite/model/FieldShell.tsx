import type { CovariantFC } from '../variance/CovariantFC'
import type { Field } from './Field'

import { type PresenterFn } from '../form/presenters/FieldPresenterProps'
import { FieldPresenterCushyUI } from '../form/presenters/PresenterCushy'

// Widget --------------------------------------------------------
// every field can defined a component to render it.
// compoentn will receive a field, and a shell/layout
// to use to render the component
export type FieldRenderProps<FIELD extends Field> = {
    field: FIELD
    shell?: FieldShellExt
    ShellProps?: Partial<PresenterFn>
}

// --------------------------------------------------------------------

export type FieldWidget<FIELD extends Field> = CovariantFC<FieldRenderProps<FIELD>>

// Shells --------------------------------------------------------
export type FieldShell = React.FC<PresenterFn>

// prettier-ignore
export type FieldShellExt =
    | FieldShell
    | WellKnownShell

// prettier-ignore
export type WellKnownShell =
    | 'field-shell-a'
    | 'field-shell-a'

export function getShellComponent(
    //
    shellExt?: FieldShellExt,
): FieldShell {
    // TODO
    return FieldPresenterCushyUI
}
