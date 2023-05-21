import type { Branded } from '../utils/types';


export type FlowID = Branded<string, 'FlowID'>;
export const asFlowID = (s: string): FlowID => s as any;
