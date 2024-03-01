export const run_prompt = (p: {
    prompt: { text: string }
    /** recommanded, but if left empty, AUTO will be used */
    clip?: _CLIP
    /** recommanded, but if left empty, AUTO will be used */
    ckpt?: _MODEL

    printWildcards?: boolean
    seed?: number
}): {
    positiveText: string
    negativeText: string
    clip: _CLIP
    ckpt: _MODEL
    readonly positiveConditionning: _CONDITIONING
    readonly negativeConditionning: _CONDITIONING
} => {
    const run = getCurrentRun()
    const richPrompt = p.prompt
    let clip = p.clip ?? run.AUTO
    let ckpt = p.ckpt ?? run.AUTO
    const CX = run.compilePrompt({
        text: richPrompt.text,
        printWildcards: p.printWildcards,
        seed: p.seed,
        onLora: (
            //
            loraName: Enum_LoraLoader_lora_name,
            strength_clip: number,
            strength_model: number,
        ) => {
            const next = run.nodes.LoraLoader({
                model: ckpt,
                clip: clip,
                lora_name: loraName,
                strength_clip: strength_clip ?? 1, // tok.loraDef.strength_clip,
                strength_model: strength_model ?? 1, // tok.loraDef.strength_model,
            })
            clip = next._CLIP
            ckpt = next._MODEL
        },
    })

    if (p.printWildcards && CX.debugText.length > 0) run.output_text({ title: 'wildcards', message: CX.debugText.join(' ') })

    return {
        positiveText: CX.positivePrompt,
        negativeText: CX.negativePrompt,
        clip,
        ckpt,
        get positiveConditionning() {
            return run.nodes.CLIPTextEncode({ clip, text: CX.positivePrompt })
        },
        get negativeConditionning() {
            return run.nodes.CLIPTextEncode({ clip, text: CX.negativePrompt })
        },
    }
}
