import { observer } from 'mobx-react-lite'

import { openExternal } from '../../app/layout/openExternal'
import { ComboUI } from '../../csuite/accelerators/ComboUI'
import { WidgetPromptUISt } from '../WidgetPromptUISt'

export const Plugin_ShortcutsUI = observer(function Plugin_ShortcutsUI_(p: { uist: WidgetPromptUISt }) {
    return (
        <div>
            <div tw='text-xs italic'>
                <div tw='flex gap-2'>
                    increase weights :
                    <ComboUI combo={'mod+j'} /> or <ComboUI combo={'mod+up'} /> or <ComboUI combo={'alt+up'} />
                    {/* (or <ComboUI combo={'mod+shift+j'} /> for tiniest scope) */}
                </div>
                <div tw='flex gap-2'>
                    decrease weights :
                    <ComboUI combo={'mod+k'} /> or <ComboUI combo={'mod+down'} /> or <ComboUI combo={'alt+down'} />
                    {/* (or <ComboUI combo={'mod+shift+j'} /> for tiniest scope) */}
                </div>
                <div
                    tw='cursor-pointer'
                    onClick={() => openExternal('https://codemirror.net/docs/ref/#commands')}
                    className='underline'
                >
                    + all the Standard (move around)
                </div>
                <div
                    tw='cursor-pointer'
                    onClick={() => openExternal('https://codemirror.net/docs/ref/#commands')}
                    className='underline'
                >
                    + Default (comment line, multi-cursors, ...) keymap
                </div>
            </div>
        </div>
    )
})
