export type FlowID = Branded<string, { FlowID: true }>
export const asFlowID = (s: string): FlowID => s as any
