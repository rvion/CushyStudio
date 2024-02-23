import type { ConfigFile } from 'src/config/ConfigFile'

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
