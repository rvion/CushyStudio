export type CardValue = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
export type CardSuit = 'spades' | 'hearts' | 'clubs' | 'diamonds'

export type CardSuitPosition = {
   x: number
   y: number
   flip?: true
   size?: number
}

export const getCardLayout = (value: CardValue): CardSuitPosition[] => {
   if (value === '1') return [{ x: 0.5, y: 0.5, size: 0.4 }]
   if (value === '2')
      return [
         { x: 0.5, y: 0.3 },
         { x: 0.5, y: 0.7 },
      ]
   if (value === '3')
      return [
         { x: 0.5, y: 0.3 },
         { x: 0.5, y: 0.7 },
         { x: 0.5, y: 0.5 },
      ]
   if (value === '4')
      return [
         { x: 0.3, y: 0.2 },
         { x: 0.3, y: 0.8 },
         { x: 0.7, y: 0.2 },
         { x: 0.7, y: 0.8 },
      ]
   if (value === '5')
      return [
         { x: 0.3, y: 0.2 },
         { x: 0.3, y: 0.8 },
         { x: 0.7, y: 0.2 },
         { x: 0.7, y: 0.8 },
         { x: 0.5, y: 0.5 },
      ]
   if (value === '6')
      return [
         { x: 0.2, y: 0.2 },
         { x: 0.2, y: 0.8 },
         { x: 0.8, y: 0.2 },
         { x: 0.8, y: 0.8 },
         { x: 0.2, y: 0.5, flip: true },
         { x: 0.8, y: 0.5, flip: true },
      ]
   if (value === '7')
      return [
         { x: 0.2, y: 0.2 },
         { x: 0.2, y: 0.8 },
         { x: 0.8, y: 0.2 },
         { x: 0.8, y: 0.8 },
         { x: 0.2, y: 0.5, flip: true },
         { x: 0.8, y: 0.5, flip: true },
         { x: 0.5, y: 0.3 },
      ]

   if (value === '8')
      return [
         { x: 0.2, y: 0.2 },
         { x: 0.2, y: 0.4 },
         { x: 0.8, y: 0.2 },
         { x: 0.8, y: 0.4 },
         { x: 0.2, y: 0.6, flip: true },
         { x: 0.2, y: 0.8, flip: true },
         { x: 0.8, y: 0.6, flip: true },
         { x: 0.8, y: 0.8, flip: true },
      ]
   if (value === '9')
      return [
         { x: 0.2, y: 0.2 },
         { x: 0.2, y: 0.4 },
         { x: 0.8, y: 0.2 },
         { x: 0.8, y: 0.4 },
         { x: 0.2, y: 0.6, flip: true },
         { x: 0.2, y: 0.8, flip: true },
         { x: 0.8, y: 0.6, flip: true },
         { x: 0.8, y: 0.8, flip: true },
         { x: 0.5, y: 0.5 },
      ]
   if (value === '10')
      return [
         { x: 0.2, y: 0.2 },
         { x: 0.2, y: 0.4 },
         { x: 0.8, y: 0.2 },
         { x: 0.8, y: 0.4 },
         { x: 0.2, y: 0.6, flip: true },
         { x: 0.2, y: 0.8, flip: true },
         { x: 0.8, y: 0.6, flip: true },
         { x: 0.8, y: 0.8, flip: true },
         { x: 0.5, y: 0.3 },
         { x: 0.5, y: 0.7 },
      ]
   return []
}
