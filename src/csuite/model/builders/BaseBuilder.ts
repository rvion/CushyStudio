import type { FieldTypes } from '../$FieldTypes'
import type { FieldConstructor_ViaClass } from '../FieldConstructor'

export class BaseBuilder<Schemaᐸ_ᐳ extends HKT<FieldTypes>> {
   constructor(protected buildSchema: BuildSchema<Schemaᐸ_ᐳ>) {}

   static buildfromSchemaClass<Sᐸ_ᐳ extends HKT<FieldTypes>, B extends BaseBuilder<Sᐸ_ᐳ>>(
      Builder: BuilderClass<Sᐸ_ᐳ, B>,
   ): (Schema: SchemaClass<Sᐸ_ᐳ>) => B {
      return (Schema) => new Builder((...p) => new Schema(...p))
   }
}

interface BuilderClass<Sᐸ_ᐳ extends HKT<FieldTypes>, B extends BaseBuilder<Sᐸ_ᐳ>> {
   new (buildSchema: BuildSchema<Sᐸ_ᐳ>): B
}

type BuildSchema<Sᐸ_ᐳ extends HKT<FieldTypes>> = <F extends FieldTypes>(
   FieldClass: FieldConstructor_ViaClass<F /* ['$Field'] */>,
   config: F['$Config'],
) => Apply<Sᐸ_ᐳ, F>

type SchemaClass<Sᐸ_ᐳ extends HKT<FieldTypes>> = {
   new <F extends FieldTypes>( //
      FieldClass: FieldConstructor_ViaClass<F /* ['$Field'] */>,
      config: F['$Config'],
   ): Apply<Sᐸ_ᐳ, F>
}
