import { compilePrompt } from 'src/controls/widgets/prompt/_compile'

export const run_prompt = (p: {
    richPrompt: { text: string }
    /** recommanded, but if left empty, AUTO will be used */
    clip?: _CLIP
    /** recommanded, but if left empty, AUTO will be used */
    ckpt?: _MODEL

    outputWildcardsPicked?: boolean
    seed?: number
}): {
    text: string
    clip: _CLIP
    ckpt: _MODEL
    conditionning: _CONDITIONING
    conditionningNeg: _CONDITIONING
} => {
    const run = getCurrentRun()
    const richPrompt = p.richPrompt
    let clip = p.clip ?? run.AUTO
    let ckpt = p.ckpt ?? run.AUTO
    const CX = compilePrompt({
        text: richPrompt.text,
        st: run.Cushy,
        printWildcards: p.outputWildcardsPicked,
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

    if (p.outputWildcardsPicked && CX.debugText.length > 0)
        run.output_text({ title: 'wildcards', message: CX.debugText.join(' ') })

    return {
        text: CX.positivePrompt,
        clip,
        ckpt,
        get conditionning() {
            return run.nodes.CLIPTextEncode({ clip, text: CX.positivePrompt })
        },
        get conditionningNeg() {
            return run.nodes.CLIPTextEncode({ clip, text: CX.negativePrompt })
        },
    }
}
