import type { Field_prompt } from '../FieldPrompt'

import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useMemo } from 'react'

import { Frame } from '../../csuite/frame/Frame'
import { useSt } from '../../state/stateContext'
import { PluginWrapperUI } from '../plugins/_PluginWrapperUI'
import { plugins } from '../plugins/PromptPluginList'
import { WidgetPromptUISt } from '../WidgetPromptUISt'

// UI

export const WidgetPromptUI = observer(function WidgetPromptUI_(p: { field: Field_prompt }) {
    const st = useSt()
    const field = p.field
    const uist = useMemo(() => new WidgetPromptUISt(field), [])
    useLayoutEffect(() => {
        if (uist.mountRef.current) uist.mount(uist.mountRef.current)
    }, [])

    // widget prompt uses codemirror, and codemirror manage its internal state itsef.
    // making the widget "uncontrolled". Usual automagical mobx-reactivity may not always apply.
    // To allow CodeMirror editor to react to external value changes, we need to use an effect
    // that track external changes, and update the editor.
    useEffect(() => {
        if (field._valueUpdatedViaAPIAt == null) return
        uist.replaceTextBy(field.text)
    }, [field._valueUpdatedViaAPIAt])

    const haveAtLeastOnePluginActive = plugins.some((plugin) => st.configFile.get(plugin.configKey) ?? false)
    return (
        <div tw='flex flex-1 flex-col'>
            <div ref={uist.mountRef}></div>

            {/* ACTIVE PLUGINS */}
            {/* <PluginToggleBarUI /> */}
            {haveAtLeastOnePluginActive && (
                <Frame className='my-1 flex flex-col gap-1 p-1'>
                    {plugins.map((plugin) => {
                        const active = st.configFile.get(plugin.configKey) ?? false
                        if (!active) return null
                        return (
                            <PluginWrapperUI key={plugin.key} plugin={plugin}>
                                <plugin.Widget uist={uist} />
                            </PluginWrapperUI>
                        )
                    })}
                </Frame>
            )}
        </div>
    )
})
