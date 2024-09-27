import type { SchemaDict } from '../../../csuite/model/SchemaDict'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { CollapsibleUI } from '../../../csuite/collapsible/CollapsibleUI'
import { Frame } from '../../../csuite/frame/Frame'
import { Field } from '../../../csuite/model/Field'
import { ShowMoreSeenCtx, useShowMoreSeen } from './ShowMoreSeenCtx'

export type QuickFormContent = ReactNode | Field | 'show more' | 'show more visible' | '*'
export type QuickFormProps = {
    field: Field
    items: QuickFormContent[]
}

export const QuickForm = observer(function QuickForm_<T extends SchemaDict>(p: QuickFormProps) {
    const seen = useShowMoreSeen()
    const subs = p.items // Fields(p.field)

    const showMore = subs.findIndex((s) => s === 'show more' || s === 'show more visible')
    if (showMore > -1) {
        const before = subs.slice(0, showMore)
        const after = subs.slice(showMore + 1)
        const startCollapsed = subs[showMore] !== 'show more visible'
        return (
            <>
                <QuickForm {...p} items={before} />
                <CollapsibleUI startCollapsed={startCollapsed} content={() => <QuickForm {...p} items={after} />} />
            </>
        )
    }

    return (
        <Frame col>
            {subs.map((s, ix) => {
                if (s instanceof Field) {
                    seen.add(s)
                    // key is not unique if we display the same field multiple times
                    // ...but it's not a realistic use case anyway
                    return <s.Render key={`${s.path}-input`} />
                }
                if (s === '*') {
                    const notSeen = p.field.childrenActive.filter((f) => !seen.has(f))
                    if (notSeen.length === 0) return null
                    return (
                        <ShowMoreSeenCtx.Provider value={useShowMoreSeen()}>
                            <QuickForm {...p} key={'*'} items={notSeen} />
                        </ShowMoreSeenCtx.Provider>
                    )
                }
                if (Array.isArray(s)) {
                    // 🔴 this syntax [foo.fields.myField, { optional: true }]
                    // is not supported at type level yet (but works)
                    // It will probably be replaced by _(foo.fields.myField, { optional: true }) anyway
                    // because it's easier to type (_ being injected in Fields)
                    const [field, props] = s
                    seen.add(field)
                    return (
                        <ShowMoreSeenCtx.Provider value={useShowMoreSeen()}>
                            <field.Render key={`${field.path}-input`} {...props} />
                        </ShowMoreSeenCtx.Provider>
                    )
                }
                // if we don't want to need to add keys:
                // return React.cloneElement(s, { key: `element-${index}` })
                // (but it will create its own problems - losing refs etc)
                return s
            })}
        </Frame>
    )
})

// export const WidgetGroupLoco = observer(function WidgetGroupLoco_<T extends SchemaDict>(p: WidgetProps<Field_group<T>>) {
//     // 2024-09-20 domi: we need to use a context to keep track of the fields that have been seen in other groups
//     return (
//         <ShowMoreSeenCtx.Provider value={useShowMoreSeen()}>
//             <QuickForm {...p} />
//         </ShowMoreSeenCtx.Provider>
//     )
// })
