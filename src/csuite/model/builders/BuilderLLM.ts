export class BuilderLLM<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
   static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderLLM)

   // @ts-ignore 🔴 loco select fields changes not ported to other builders
   // llmModel(p: { default?: OpenRouter_Models } = {}): S.SSelectOne<{
   //     id: OpenRouter_Models
   //     label: string
   // }> {
   //     const choices = Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name }))
   //     const def = p.default ? choices.find((c) => c.id === p.default) : undefined
   //     // @ts-ignore 🔴 loco select fields changes not ported to other builders
   //     return this.selectOne({ default: def, choices })
   // }
}
