import type { FieldTypes } from './$FieldTypes'
import type { Field } from './Field'
import type { Repository } from './Repository'

export interface Instanciable<TYPES extends FieldTypes = FieldTypes> {
   // 1.
   $Type: TYPES['$Type']
   $Config: TYPES['$Config']
   $Serial: TYPES['$Serial']
   $Value: TYPES['$Value']
   $Field: TYPES['$Field']
   $Unchecked: TYPES['$Unchecked']
   $Child: TYPES['$Child']
   $Reflect: TYPES['$Reflect']

   // 2.
   type: TYPES['$Type']
   config: TYPES['$Config']

   instanciate(
      // 3.
      repo: Repository,
      root: Field<any> | null,
      parent: Field | null,
      initialMountKey: string,
      serial: any | null,
   ): TYPES['$Field']
}
