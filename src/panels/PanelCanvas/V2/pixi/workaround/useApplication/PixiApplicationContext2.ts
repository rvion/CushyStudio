import type { Application, Renderer } from 'pixi.js'

import React from 'react'

export const PixiApplicationContext2 = React.createContext<Application<Renderer> | null>(null)

export const useApplication2 = (): Application<Renderer> => {
   const res = React.useContext(PixiApplicationContext2)
   if (res == null) throw new Error('usePixiApplicationContext2: no value')
   return res
}
