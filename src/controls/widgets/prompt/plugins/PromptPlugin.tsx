import { type FC } from 'react'
import { WidgetPromptUISt } from '../WidgetPromptUISt'

export type PromptPlugin = {
    key: string
    icon: string
    title: string
    description: string
    Widget: FC<{ uist: WidgetPromptUISt }>
}
