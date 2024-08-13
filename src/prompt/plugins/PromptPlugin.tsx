import type { ConfigFile } from '../../config/ConfigFile'
import type { IconName } from '../../csuite/icons/icons'
import type { WidgetPromptUISt } from '../WidgetPromptUISt'
import type { FC } from 'react'

export type PromptPlugin = {
    key: string
    configKey: keyof ConfigFile
    icon: IconName
    title: string
    description: string
    Widget: FC<{ uist: WidgetPromptUISt }>
}
