import type { OutputFor } from './_prefabs'

export const ui_regionalPrompting_v1 = () => {
    const form = getCurrentForm()
    return form.regional({
        element: form.group({
            items: {
                prompt: form.prompt({}),
                strength: form.number({ default: 1, min: 0, max: 2, step: 0.1 }),
                // mode: form.enum.Enum_ConditioningBlend_blending_mode({}),
            },
        }),
        height: 512,
        width: 512,
        initialPosition: () => ({
            x: 0,
            y: 0,
            width: 128,
            height: 128,
            fill: `#${Math.round(Math.random() * 0xffffff).toString(16)}`,
        }),
    })
}

export const run_regionalPrompting_v1 = (
    ui: OutputFor<typeof ui_regionalPrompting_v1>,
    p: {
        conditionning: _CONDITIONING
        clip: _CLIP
    },
): _CONDITIONING => {
    const run = getCurrentRun()
    let positive = p.conditionning
    const graph = run.nodes
    for (const square of ui.items) {
        const squareCond = graph.ConditioningSetArea({
            conditioning: graph.CLIPTextEncode({ clip: p.clip, text: square.value.prompt.text }),
            height: square.position.height,
            width: square.position.width,
            x: square.position.x,
            y: square.position.y,
            strength: square.value.strength,
        })
        // positive = graph.ConditioningBlend({
        //     conditioning_a: positive,
        //     conditioning_b: squareCond,
        //     blending_strength: square.value.strength,
        //     blending_mode: square.value.mode,
        // })
        positive = graph.ConditioningCombine({
            conditioning_1: positive,
            conditioning_2: squareCond,
        })
    }
    return positive
}
