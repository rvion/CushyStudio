import { Frame } from '../csuite/frame/Frame'

const ticket = cushy.forms.form((ui) =>
    ui
        .fields({
            title: ui.text().skins({
                UIRougeEtGrass: (p: { a: number }) => p.a,
                grid: (p: {}) => null,
            }),
            prio: ui.int(),
            foo: ui.int(),
            bar: ui.int(),
            baz: ui.fields({
                foo: ui.int(),
                quux: ui.int(),
            }),
        })
        .actions({
            archive: (self) => {
                console.log(`[🤠] archivé`)
            },
        })
        .skins({
            UIDianeV1: {
                title: 'EN_ROUGE_ET_GRAS',
                prio: true,
                baz: { foo: true },
            },
            UIDianeV2: (p) => {
                const f = p.widget.fields
                return (
                    <Frame>
                        <f.title.UIRougeEtGrass a={0} />
                        <f.title.UITextarea />
                        {/* <f.prio. /> */}
                        {f.prio.renderSimple()}
                    </Frame>
                )
            },
        }),
)

/**
const x =() => (
    <>
        <Button onClick(() => ticket.archive) />
        {ticket.fields}
        {ticket.fields.title.as('EN_ROUGE_ET_GRAS')}
        {ticket.fields.title.renderSkin('EN_ROUGE_ET_GRAS')}
        {ticket.fields.title.renderSkin('EN_ROUGE_ET_GRAS')}
    </>
)

*/
//
// const ticketVue1234 = new Form(ticket, {
//     fields: ['title:EN_ROUGE_ET_GRAS', 'prio'],
// })
