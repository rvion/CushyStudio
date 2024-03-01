import { observer } from 'mobx-react-lite'

app({
    metadata: {
        name: 'Cushy Diffusion',
        illustration: 'library/built-in/_illustrations/mc.jpg',
        description:
            'An example app to play with various stable diffusion technologies. Feel free to contribute improvements to it.',
    },
    ui: (form) => ({
        // ---------------------------------------------------------------
        test: form.custom({
            // customDat
            // subTree:
            defaultValue: () => ({ foo: 1, bar: 'test' }),
            // subTree
            Component: observer((p) => {
                const uist = p.widget.serial.value
                return (
                    <div tw='flex'>
                        <div tw='loading loading-spinner'></div>
                        <p.extra.InputNumberUI
                            //
                            mode='int'
                            value={uist.foo}
                            onValueChange={(next) => (uist.foo = next)}
                        />
                        <div>{uist.foo > 3 ? <div>Hi</div> : <div>Hello</div>}</div>
                        <p.extra.InputNumberUI
                            //
                            mode='int'
                            value={uist.foo}
                            onValueChange={(next) => (uist.foo = next)}
                        />
                        !!
                    </div>
                )
            }),
        }),
        // ---------------------------------------------------------------
    }),

    run: async (run, ui, imgCtx) => {},
})
