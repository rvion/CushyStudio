import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo } from 'react'
import { SortableKnob } from 'react-easy-sort'
import { openExternal } from 'src/app/layout/openExternal'
import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { LoraBoxUI } from 'src/widgets/prompter/nodes/lora/LoraBoxUI'
import { Widget_prompt } from './WidgetPrompt'
import { WidgetPromptUISt } from './WidgetPromptUISt'
import { PromptPluginReorderTopLevelStuffUI } from './plugins/PromptPluginReorderTopLevelStuffUI'
import { PluginWrapperUI } from './plugins/_PluginWrapperUI'
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
            <div>
                <div tw='btn btn-icon btn-square btn-xs btn-outline'>
                    <span className='material-symbols-outlined'>remove_red_eye</span>
                </div>
                <div tw='btn btn-icon btn-square btn-xs btn-outline'>
                    <span className='material-symbols-outlined'>format_list_numbered</span>
                </div>
                <div tw='btn btn-icon btn-square btn-xs btn-outline'>
                    <span className='material-symbols-outlined'>format_list_numbered</span>
                </div>
                <div tw='btn btn-icon btn-square btn-xs btn-outline'>
                    <span className='material-symbols-outlined'>format_list_numbered</span>
                </div>
                <div tw='btn btn-icon btn-square btn-xs btn-outline'>
                    <span className='material-symbols-outlined'>format_list_numbered</span>
                </div>
            </div>

            <div className='flex flex-col gap-1'>
                <PromptPluginReorderTopLevelStuffUI uist={uist} />
                <PluginWrapperUI title='Keyboard Shortcuts'>
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
                </PluginWrapperUI>

                <PluginWrapperUI title='Adjust weights'>
                    {uist.ast.findAll('WeightedExpression').map((w) => (
                        <div tw='flex items-center'>
                            <div tw='w-40 line-clamp-1 whitespace-nowrap'>{w.text.slice(1, -5)}</div>
                            <InputNumberUI onValueChange={(v) => (w.weight = v)} mode='float' value={w.weight} min={0} max={2} />
                        </div>
                    ))}
                </PluginWrapperUI>

                <PluginWrapperUI title='Preview Prompt'>
                    <pre tw='virtualBorder whitespace-pre-wrap text-sm bg-base-200'>{uist.compiled.positivePrompt}</pre>
                    <pre tw='virtualBorder whitespace-pre-wrap text-sm bg-base-200'>{uist.compiled.negativePrompt}</pre>
                </PluginWrapperUI>

                {/* OPTIONAL WIDGET 1 */}
                <PluginWrapperUI title='Lora plugin'>
                    {uist.loras.map((x) => {
                        return <LoraBoxUI uist={uist} def={x} onDelete={() => {}} />
                    })}
                </PluginWrapperUI>
                <PluginWrapperUI title='Show Ast'>
                    <pre tw='virtualBorder whitespace-pre-wrap text-xs bg-base-200'>{uist.debugView}</pre>
                </PluginWrapperUI>
            </div>
        </div>
    )
})
