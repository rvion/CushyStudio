import { describe, expect, it } from 'bun:test'

import { PromptAST } from './grammar.practical'

// (masterpiece, tree)x-0.8, (*color)x0.6 @"xl\pxll.safetensors"[.2,.8]`
// const test1 = `%posewildcard, <lora:abc:0.9>, (nsfw:1.3), (a,b,c), embedding:bad1, <lora:ab>, <lora:ab:-1>`
const test1 = `<lora:a:1> ?foo (baz, <lora:test:-2,3>:1.2) ((a)), embedding:test`
const expr = new PromptAST(test1)
console.log(expr.toString())
describe('prompt grammar', () => {
    it('parse', () => {
        expect(expr.toString()).toBe(
            [
                `Prompt: `,
                `  Lora: "<lora:a:1>" (weight=1)`,
                `    Identifier: "a"`,
                `    Number: "1"`,
                `  Wildcard: "?foo"`,
                `    Identifier: "foo"`,
                `  WeightedExpression: "(baz, <lora:test:-2,3>:1.2)"`,
                `    Content: `,
                `      Identifier: "baz"`,
                `      Separator: ","`,
                `      Lora: "<lora:test:-2,3>" (weight=3)`,
                `        Identifier: "test"`,
                `        Number: "-2"`,
                `        Number: "3"`,
                `    Number: "1.2"`,
                `  WeightedExpression: \"((a))\"`,
                `    Content: `,
                `      WeightedExpression: \"(a)\"`,
                `        Content: `,
                `          Identifier: \"a\"`,
                `  Separator: ","`,
                `  Embedding: "embedding:test"`,
                `    Identifier: "test"`,
            ].join('\n'),
        )
    })

    it('find all Lora', () => {
        const matches = expr.findAll('Lora')
        expect(matches.length).toBe(2)
        expect(matches[0]!.name).toBe('a' as any)
        expect(matches[0]!.strength_clip).toBe(1)
        expect(matches[1]!.name).toBe('test' as any)
        expect(matches[1]!.strength_clip).toBe(3)
    })

    it('properly understand simple weights', () => {
        const matches = expr.findAll('WeightedExpression')
        expect(matches.length).toBe(3)
        const m1 = matches[0]!
        const m2 = matches[1]!
        const m3 = matches[2]!
        expect(m1.weight).toBe(1.2)
        expect(m2.weight).toBe(1.1)
        expect(m3.weight).toBe(1.1)
    })

    // const end = Date.now()
    // console.log(`[🧐]`, end - start, 'ms')
})
