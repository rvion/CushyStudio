import type { ConfigFile } from '../../../../config/ConfigFile'

import { type FC } from 'react'

import { WidgetPromptUISt } from '../WidgetPromptUISt'

export type PromptPlugin = {
    key: string
    configKey: keyof ConfigFile
    icon: string
    title: string
    description: string
    Widget: FC<{ uist: WidgetPromptUISt }>
}
