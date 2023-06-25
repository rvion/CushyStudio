import type { LiveInstance } from '../db/LiveInstance'

export interface Foo extends LiveInstance<{ id: string }, Foo> {}
export class Foo {}
