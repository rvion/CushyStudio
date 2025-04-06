import { samplePrompts } from '../../../samplePrompts'

export type $WeaverPromptRegion = Z.Group<{
   enabled: Z.Bool
   x: Z.Number
   y: Z.Number
   width: Z.Number
   height: Z.Number
   scale: Z.Group<{
      x: Z.Number
      y: Z.Number
   }>
   lock: Z.Bool
}>

function weaverPromptRegion(b: Z.Builder, options?: {}): $WeaverPromptRegion {
   return b.fields({
      enabled: b.bool({ default: true }),
      x: b.number({ default: 0 }),
      y: b.number({ default: 0 }),
      width: b.number({ default: 512 }),
      height: b.number({ default: 512 }),
      scale: b.fields({
         //
         x: b.number({ default: 1, step: 0.1 }),
         y: b.number({ default: 1, step: 0.1 }),
      }),
      lock: b.bool(),
   })
}

export type $WeaverPromptRegionList = Z.Group<{}>

// export type $WeaverPromptConditioning = X.SelectOne_<'' | 'test'>

export type $WeaverPrompt = Z.Group<{
   enabled: Z.Bool
   name: Z.String
   prompt: Z.Prompt
   positive: Z.Bool
   regions: Z.List<$WeaverPromptRegion>
}>

export function weaverPrompt(b: Z.Builder, options?: { default?: string }): $WeaverPrompt {
   return b.fields(
      //
      {
         enabled: b.bool({ default: true, hidden: true }),
         name: b.string({ default: '', hidden: true }),
         positive: b.bool({
            default: true,
            hidden: true,
            description: 'When true, the prompt will apply positively',
         }),
         prompt: b.prompt({
            icon: IKONS.mdiPlusBoxOutline,
            // background: { hue: 150, chroma: 0.05 },
            default: options?.default ?? '',
            presets: [
               //
               {
                  label: 'Portrait',
                  icon: IKONS.mdiFaceWoman,
                  apply: (w) => w.setText('portrait, face'),
               },
               {
                  label: 'Landscape',
                  icon: IKONS.mdiImageFilterHdr,
                  apply: (w) => w.setText('landscape, nature'),
               },
               { label: 'Tree', icon: IKONS.mdiTree, apply: (w) => w.setText(samplePrompts.tree) },
               { label: 'Abstract', icon: IKONS.mdiShape, apply: (w) => w.setText('abstract, art') },
            ],
         }),
         regions: weaverPromptRegion(b).list({ hidden: true }),
      },
   )
}

export type $WeaverPromptList = Z.Group<{
   activeIndex: Z.Number
   showEditor: Z.Bool
   showOptions: Z.Bool
   prompts: Z.List<$WeaverPrompt>
}>

export function promptList(b: Z.Builder, options?: { default?: string }): $WeaverPromptList {
   const tags = cushy.danbooru.tags
   // const artists = tags.filter((t) => t.category === 1).map((t) => t.text)

   return b.fields(
      {
         activeIndex: b.int({ default: 0, hidden: true }),
         showEditor: b.bool({ default: true, hidden: true }),
         showOptions: b.bool({ default: true, hidden: true }),
         prompts: weaverPrompt(b) //
            .list({ min: 1 }),
         // regionalPrompt: ui_regionalPrompting_v1(b)
         //    // .withConfig({ uiui: { Head: false } })
         //    .subscribe(latentSizeChanel, (s, self) => {
         //       const area = self.fields.area
         //       self.fields.area.runInTransaction(() => {
         //          area.width = s.w
         //          area.height = s.h
         //       })
         //    })
         //    .optional(),
         // artists: b.selectManyStrings(artists),
         // artistsV2: b.selectManyOptionIds(
         //     tags.filter((t) => t.category === 1).map((t) => ({ id: t.text, label: `${t.text} (${t.count})` })),
         // ),
      },
      { icon: IKONS.mdiTextBoxPlus },
   )
}
