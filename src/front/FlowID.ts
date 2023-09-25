export type FlowID = Branded<string, 'FlowID'>
export const asFlowID = (s: string): FlowID => s as any
