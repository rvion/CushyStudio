import { PromptAST } from './grammar.practical'

// (masterpiece, tree)x-0.8, (*color)x0.6 @"xl\pxll.safetensors"[.2,.8]`
const test1 = `@a[1] ?foo (baz, @test[-2,3])*1.2`
// const start = Date.now()
const expr = new PromptAST(test1)
expr.print()

expr.findAll('Lora').map((l) => {
    console.log(`lora "${l.name}" has weight ${l.strength_clip} `)
})

// const end = Date.now()
// console.log(`[👙]`, end - start, 'ms')
