import { describe, expect, it } from 'bun:test'
import { parse } from 'culori'
import { inP3, inSrgb } from '../culori-utils/culoriUtils'
import { clampColorToSpace } from './clampColorToSpace'

describe('apcach', () => {
    it('does something', () => {
        expect(inSrgb('blue')).toBeTrue()
        expect(inP3('blue')).toBeFalse()
        // expect(inP3('p3(oklch 50 50 50)')).toBeTrue()

        const blue = parse('blue')
        if (blue == null) throw new Error('x is null')

        expect(clampColorToSpace(blue, 'p3')).toMatchObject({
            mode: 'p3',
            r: 0.00007593487415871847,
            g: 0.0006735193761064716,
            b: 0.9594334877858083,
        })
        expect(clampColorToSpace(blue, 'rgb')).toMatchObject({
            mode: 'rgb',
            r: 0,
            g: 0,
            b: 1,
        })
    })
})
