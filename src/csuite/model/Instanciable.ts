import type { FieldTypes } from './$FieldTypes'
import type { Field } from './Field'
import type { Repository } from './Repository'

export interface Instanciable<TYPES extends FieldTypes = FieldTypes> {
   // 1.
   $type: TYPES['$type']
   $config: TYPES['$config']
   $serial: TYPES['$serial']
   $value: TYPES['$value']
   $field: TYPES['$field']
   $unchecked: TYPES['$unchecked']
   $child: TYPES['$child']

   // 2.
   type: TYPES['$type']
   config: TYPES['$config']

   instanciate(
      // 3.
      repo: Repository,
      root: Field<any> | null,
      parent: Field | null,
      initialMountKey: string,
      serial: any | null,
   ): TYPES['$field']
}
