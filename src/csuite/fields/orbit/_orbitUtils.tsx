// UTILS
// import { suspend } from 'suspend-react'
// const inter = import('@pmndrs/assets/fonts/inter_regular.woff')
// useFrame((state) => (textRef.current!.position!.x = Math.sin(state.clock.elapsedTime) * 2))
export const clampMod = (v: number, min: number, max: number) => {
   const rangeSize = max - min + 1
   return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

const inRange = (val: number, min: number, max: number, margin: number = 0) => {
   return val >= min - margin && val <= max + margin
}

export const mkEnglishSummary = (
   /** in deg; from -180 to 180 */
   azimuth: number,
   /** in deg, from -90 to 90 */
   elevation: number,
): string => {
   const words: string[] = []
   // const azimuth = this.state.val.azimuth
   // faces: front, back, left, right
   const margin = 20

   if (inRange(elevation, -90, -80, margin)) words.push('from-below')
   else if (inRange(elevation, 80, 90, 0)) words.push('from-above')
   else {
      if (inRange(elevation, -80, -45, 0)) words.push('low')
      else if (inRange(elevation, 45, 80, 0)) words.push('high')

      if (inRange(azimuth, -180, -135, margin)) words.push('back')
      else if (inRange(azimuth, 135, 180, margin)) words.push('back')
      else if (inRange(azimuth, -45, 45, margin)) words.push('front')
      else {
         if (inRange(azimuth, -135, -45, margin))
            words.push('righ-side') // 'right')
         else if (inRange(azimuth, 45, 135, margin)) words.push('left-side') // left')
      }
   }

   return `${words.join('-')} view`
}
