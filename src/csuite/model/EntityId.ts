import { nanoid } from 'nanoid'

/** globally unique string used to identify an Entity */
export type EntityId = Branded<string, { EntityId: true }>

/**
 * function to generate a new EntityId
 * not configurable for now; may be later when we try to optimize serial size
 */
export function mkNewEntityId(): EntityId {
    return nanoid() as EntityId
}
