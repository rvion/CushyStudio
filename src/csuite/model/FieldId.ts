import { nanoid } from 'nanoid'
import { v7 } from 'uuid'

/** globally unique string used to identify an Entity */
export type FieldId = Branded<string, { FieldId: true }>

/**
 * function to generate a new EntityId
 * not configurable for now; may be later when we try to optimize serial size
 */
export function mkNewFieldId_v1(): FieldId {
   return nanoid(8) as FieldId
}

// slightly safer than nanoid(8) at the cost of twice the size
export function mkNewFieldId_v2(): FieldId {
   return nanoid() as FieldId
}

// slightly more standard than nanoid
// | import shortUUID from 'short-uuid'
// | const short = shortUUID()
// | export function mkNewFieldId_v3(): FieldId {
// |    return short.generate() as unknown as FieldId
// | }

// 💬 2025-04-01 rvion:
// I think we should change to v7 for most things.
// not that important for volatile state (e.g. `field._uid`)
// will also help later with reconciliation
export function mkNewFieldId_v4(): FieldId {
   return v7() as FieldId
}

// 💬 2025-04-01 rvion:
// not imported cause it's some fun & crappy stuff; just handy if
// minimizing the number of char + requiring v7 is the more important than
// beeing serious (encode uuid as 10 same-width chinese chars)
//
// | import { CjkUuidEncoder } from './FieldSmartId'
// | const cjkUuidEncoder = new CjkUuidEncoder()
// | export function mkNewFieldId_v5(): FieldId{
// |    const uuid = v7()
// |    cjkUuidEncoder.encode(uuid)
// |    return uuid as FieldId
// | }
