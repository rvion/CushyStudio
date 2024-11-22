import { useEffect, useState } from 'react'

export const useTicker = ({
   everyMS = 1000,
}: {
   /** in seconds */
   everyMS: number
}): number => {
   const [tick, setTick] = useState(0)
   useEffect(() => {
      const interval = setInterval(() => {
         setTick(tick + 1)
      }, everyMS)
      return (): void => clearInterval(interval)
   }, [tick])
   return tick
}
