import { describe, expect as expect_, it } from 'bun:test'
import { toJS } from 'mobx'

import { SimpleModelManager } from '../'

describe('entity', () => {
    it('works', () => {
        const ent = SimpleModelManager.form((f) => f.fields({}))
        expect(ent).toBeTruthy()
        expect(ent.value).toMatchObject({})
    })

    it('works', () => {
        const E = SimpleModelManager.form((f) => f.fields({ md: f.markdown('ok') }))
        expect(E).toBeTruthy()
        expect(E.subWidgets.length).toBe(1)
        expect(E.subWidgets[0]!.type).toBe('markdown')
        expect(E.root.value.md).toMatchObject({
            collapsed: undefined,
            type: 'markdown',
        })
    })
})

function expect(a: any) {
    return expect_(toJS(a))
}
