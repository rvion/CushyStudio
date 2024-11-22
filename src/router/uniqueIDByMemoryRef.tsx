import { nanoid } from 'nanoid'

const memoryRefByUniqueID = new WeakMap<object, string>()
export const uniqueIDByMemoryRef = (x: object): string => {
   let id = memoryRefByUniqueID.get(x)
   if (id == null) {
      id = nanoid()
      memoryRefByUniqueID.set(x, id)
   }
   return id
}
