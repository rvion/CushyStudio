import type { Branded } from './types'

export type MDContent = Branded<string, 'MDContent'>
export type HTMLContent = Branded<string, 'HTML'>

export const asMDContent = (s: string): MDContent => s as MDContent
export const asHTMLContent = (s: string): HTMLContent => s as HTMLContent
