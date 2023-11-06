export type MDContent = Branded<string, { MDContent: true }>
export type HTMLContent = Branded<string, { HTML: true }>

export const asMDContent = (s: string): MDContent => s as MDContent
export const asHTMLContent = (s: string): HTMLContent => s as HTMLContent
