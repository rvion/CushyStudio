import { createRandomGenerator } from './createRandomGenerator'

export const chooseRandomly = <T>(key: string, seed: number, arr: T[]): T => {
   return createRandomGenerator(`${key}:${seed}`).randomItem(arr)!
}
