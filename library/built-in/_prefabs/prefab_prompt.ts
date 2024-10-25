export const run_prompt = (p: {
   prompt: { text: string }
   /** recommanded, but if left empty, AUTO will be used */
   clip?: _CLIP
   /** recommanded, but if left empty, AUTO will be used */
   ckpt?: _MODEL

   printWildcards?: boolean
   seed?: number
}): {
   promptIncludingBreaks: string
   clip: _CLIP
   ckpt: _MODEL
   readonly conditioning: _CONDITIONING
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

   if (p.printWildcards && CX.debugText.length > 0) {
      run.output_text({ title: 'wildcards', message: CX.debugText.join(' ') })
   }

   return {
      promptIncludingBreaks: CX.promptIncludingBreaks,
      clip,
      ckpt,
      get conditioning() {
         if (CX.subPrompts.length > 1) {
            let start: _CONDITIONING = run.nodes.CLIPTextEncode({ clip, text: CX.subPrompts[0]! })
            for (let i = 1; i < CX.subPrompts.length; i++) {
               start = run.nodes.ConditioningConcat({
                  conditioning_from: start,
                  conditioning_to: run.nodes.CLIPTextEncode({ clip, text: CX.subPrompts[i]! }),
               })
            }
            return start
         }
         return run.nodes.CLIPTextEncode({ clip, text: CX.promptIncludingBreaks })
      },
   }
}
