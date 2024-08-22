import type { Field } from '../model/Field'
import type { FieldPresenterComponents } from './FieldPresenterComponents'
import type { FC } from 'react'

export interface FieldPresenterProps</* FIELD extends Field */>extends FieldPresenterComponents {
    // Specific to the given fielid --------------------------------------------------------
    // that part of the object may be overwritten by each field parent ❓
    Shell: FC<FieldPresenterProps>

    // the field beeing rendered
    field: Field

    // /** custom UI for root (won't be passed down) */
    // UI?: FC<FieldPresenterProps<FIELD>>

    // Specific to everything else --------------------------------------------------------
    /**
     * custom UI for each component type or at realtive subFields
     *
     *   ```ts
     *   UIS={(field) => {
     *      // 👇 to modify every Boolean to use a switch
     *      if (isFieldBool(field)) return { Header: SwitchHeader }
     *
     *      // 👇 to modify specific rules at give path
     *      // (you can copy the field paths from the field menu)
     *      if (field.path === 'foo.bar.items.8') return { Header: MyHeader }
     *
     *      // 👇 to modify the UI of the first item of a list
     *      const parent = field.parent
     *      if (isFieldList(parent) && field.mountKey === '0') return { Header: MyHeader }
     *   }}
     *   ```
     *
     * */
    UIs?: (field: Field) => FieldPresenterComponents

    /** override the fieldName */
    fieldName?: string

    /** various classNames */
    className?: string
    classNameAroundBodyAndHeader?: string

    /** show hidden  */
    showHidden?: () => boolean
}

// (v1)
// UIErrors?: boolean
// UILabel?: Maybe<FC<NO_PROPS> | ReactNode>
// UISchemaExtra?: Maybe<FC<NO_PROPS> | ReactNode>
// UIUndo?: Maybe<FC<NO_PROPS> | ReactNode>
// UIActionMenu?: Maybe<FC<NO_PROPS> | ReactNode>
// UIIndent?: Maybe<FC<NO_PROPS> | ReactNode>
// UIHeader?: Maybe<FC<NO_PROPS> | ReactNode>
// UIBody?: Maybe<FC<NO_PROPS> | ReactNode>
// UIToggle?: Maybe<FC<NO_PROPS> | ReactNode>
// UIDelete?: Maybe<FC<NO_PROPS> | ReactNode>
// UIDragKnob?: Maybe<FC<NO_PROPS> | ReactNode>
// UIUpDown?: Maybe<FC<NO_PROPS> | ReactNode>
// 👇

/**
 * override the label (false to force disable the label)
 * some widget like `choice`, already display the selected header in their own way
 * so they may want to skip the label.
 * (v2)
 * */
// Header: EZRenderable<{ field: Field }>
// Body: EZRenderable<{ field: Field }>
// Errors: EZRenderable<{ field: Field }>
// Indent: EZRenderable<{ depth?: number } & FrameProps>
// DragKnob: EZRenderable<FrameProps>
// UndoBtn: EZRenderable<{ field: Field }>
// ToogleUI: EZRenderable<{ field: Field }>
// ContainerForHeader: EZRenderable<{ field: Field }>
// ContainerForBody: EZRenderable<{ field: Field }>
// ContainerForSummary: EZRenderable<{ field: Field }>
// DebugID: EZRenderable<{ field: Field }>
// EasterEgg: EZRenderable<{ field: Field }>

// 👇
