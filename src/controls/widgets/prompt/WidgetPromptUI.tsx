import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo } from 'react'
import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { LoraBoxUI, LoraTextNode } from 'src/widgets/prompter/nodes/lora/LoraBoxUI'
import { Widget_prompt } from './WidgetPrompt'
import { openExternal } from 'src/app/layout/openExternal'
import { WidgetPromptUISt } from './WidgetPromptUISt'
// UI
export const WidgetPromptUI = observer(function WidgetPromptUI_(p: { widget: Widget_prompt }) {
    const widget = p.widget
    const uist = useMemo(() => new WidgetPromptUISt(widget), [])
    useLayoutEffect(() => {
        if (uist.mountRef.current) uist.mount(uist.mountRef.current)
    }, [])

    return (
        <div tw='flex flex-col'>
            <div tw='bd1' ref={uist.mountRef}></div>
            <summary tw='text-sm'>
                <details>
                    <pre tw='virtualBorder whitespace-pre-wrap text-sm bg-base-200'>{uist.compiled.positivePrompt}</pre>
                    <pre tw='virtualBorder whitespace-pre-wrap text-sm bg-base-200'>{uist.compiled.negativePrompt}</pre>
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
                    <pre tw='virtualBorder whitespace-pre-wrap text-xs bg-base-200'>{uist.debugView}</pre>
                </details>
            </summary>
            {uist.loras.map((x: LoraTextNode) => {
                return <LoraBoxUI uist={uist} def={x} onDelete={() => {}} />
            })}
        </div>
    )
})
