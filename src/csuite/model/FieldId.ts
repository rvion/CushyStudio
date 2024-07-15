import { nanoid } from 'nanoid'

/** globally unique string used to identify an Entity */
export type FieldId = Branded<string, { FieldId: true }>

/**
 * function to generate a new EntityId
 * not configurable for now; may be later when we try to optimize serial size
 */
export function mkNewFieldId(): FieldId {
    return nanoid(8) as FieldId
}
