import { InputStringUI } from '../../src/csuite/input-string/InputStringUI'
import { LegacyFieldUI } from '../../src/panels/PanelConfig/LegacyFieldUI'

const _defaultSystemPrompt = [
   `You are an assistant in charge of converting image prompt written in nataural language to sequence of danbooru tags, coma separated`,
   `Your answer must be arond 500 chars in length`,
   `Start with most important tags describing the prompt`,
   `ONLY answer with the prompt itself. DO NOT answer anything else. No Hello, no thanks, no signature, no nothing.`,
].join('\n')

app({
   ui: (b) =>
      b.fields({
         topic: b.string({ textarea: true, default: 'portrait of a sexy furry sheep princess' }),
         llmModel: b.llmModel().withConfig({
            uiui: (b) =>
               b.apply({
                  Body: () => (
                     <div>
                        <LegacyFieldUI label='OpenRouter API KEY'>
                           <InputStringUI
                              icon='mdiKey'
                              type='password'
                              getValue={() => cushy.configFile.value.OPENROUTER_API_KEY ?? ''}
                              setValue={(next) => cushy.configFile.update({ OPENROUTER_API_KEY: next })}
                           />
                        </LegacyFieldUI>
                     </div>
                  ),
               }),
         }),
         customSystemMessage: b.group({
            startCollapsed: true,
            items: {
               system: b.string({
                  textarea: true,
                  default: _defaultSystemPrompt,
                  tooltip:
                     'Try experimenting with the system prompt. You may get better results from different models depending on how specific the instructions are.',
               }),
            },
         }),
         promptFromLlm: b.markdown({ markdown: `` }),
      }),

   run: async (sdk, ui) => {
      if (!sdk.LLM.isConfigured) {
         sdk.output_text(`Enter your api key in Config`)
         return
      }

      // ask LLM to generate
      const llmResult = await sdk.LLM.expandPrompt(ui.topic, ui.llmModel.id, ui.customSystemMessage.system)
      const positiveTxt = llmResult.prompt
      sdk.form.fields.promptFromLlm.config.markdown = positiveTxt
      sdk.output_text(positiveTxt)
   },
})
