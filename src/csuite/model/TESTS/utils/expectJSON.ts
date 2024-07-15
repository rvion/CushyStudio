import { expect, type Matchers } from 'bun:test'

export function expectJSON(a: any): Matchers<any> {
    return expect(JSON.parse(JSON.stringify(a)))
}
