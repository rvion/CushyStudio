export type PatchOperation = 'add' | 'replace' | 'remove'

export type Patch_Common<FieldType extends CATALOG.AllFieldTypes = CATALOG.AllFieldTypes> = {
   op: string
   fieldPath: string
   fieldType: FieldType
}

// prettier-ignore
export type Patch<
   FieldType extends CATALOG.AllFieldTypes = CATALOG.AllFieldTypes,
   TValue = unknown,
> =
   | PatchAdd<FieldType, TValue>
   | PatchReplace<FieldType, TValue>
   | PatchRemove<FieldType>

export type PatchAdd<FieldType extends CATALOG.AllFieldTypes, TSerial = unknown> = Patch_Common<FieldType> & {
   op: 'add'
   serialPath: string
   value: TSerial
}
export type PatchReplace<
   FieldType extends CATALOG.AllFieldTypes,
   TSerial = unknown,
> = Patch_Common<FieldType> & {
   op: 'replace'
   serialPath: string
   value: TSerial
}

export type PatchRemove<FieldType extends CATALOG.AllFieldTypes> = Patch_Common<FieldType> & {
   op: 'remove'
   serialPath: string
}

export function isPatchAdd<
   FieldType extends CATALOG.AllFieldTypes = CATALOG.AllFieldTypes,
   TSerial = unknown,
>(patch: Patch_Common<FieldType>): patch is PatchAdd<FieldType, TSerial> {
   return (
      patch.op === 'add' &&
      Object.prototype.hasOwnProperty.call(patch, 'value') &&
      Object.prototype.hasOwnProperty.call(patch, 'serialPath')
   )
}

export function isPatchReplace<
   FieldType extends CATALOG.AllFieldTypes = CATALOG.AllFieldTypes,
   TSerial = unknown,
>(patch: Patch_Common<FieldType>): patch is PatchReplace<FieldType, TSerial> {
   return (
      patch.op === 'replace' &&
      Object.prototype.hasOwnProperty.call(patch, 'value') &&
      Object.prototype.hasOwnProperty.call(patch, 'serialPath')
   )
}

export function isPatchRemove<FieldType extends CATALOG.AllFieldTypes = CATALOG.AllFieldTypes>(
   patch: Patch_Common<FieldType>,
): patch is PatchRemove<FieldType> {
   return patch.op === 'remove' && Object.prototype.hasOwnProperty.call(patch, 'serialPath')
}
