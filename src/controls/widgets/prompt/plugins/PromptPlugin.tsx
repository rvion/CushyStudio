import type { ConfigFile } from '../../../../config/ConfigFile'
import type { IconName } from '../../../../csuite/icons/icons'

import { type FC } from 'react'

import { WidgetPromptUISt } from '../WidgetPromptUISt'

export type PromptPlugin = {
    key: string
    configKey: keyof ConfigFile
    icon: IconName
    title: string
    description: string
    Widget: FC<{ uist: WidgetPromptUISt }>
}
