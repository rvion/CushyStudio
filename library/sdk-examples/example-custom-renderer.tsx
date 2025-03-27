app({
   metadata: {
      name: 'Example custom renderer',
      illustration: 'library/built-in/_illustrations/mc.jpg',
      description: 'Example of a custom renderer',
   },
   ui: (b) =>
      b.fields({
         a: b.header('Custom with a group header using child widgets:'),
         testA: b.fields(
            { a: b.int(), b: b.string(), c: b.string() },
            {
               uiui: {
                  Header: ({ field }) => (
                     <div tw='flex'>
                        <field.zFields.a.UI Shell={uy.shell.HeaderOnly} />
                        <field.zFields.b.UI Shell={uy.shell.HeaderOnly} />
                        <field.zFields.a.UI Shell={uy.shell.HeaderOnly} />
                     </div>
                  ),
               },
            },
         ),

         b: b.header('Same as above, but without body:'),
         testB: b.fields(
            { a: b.int(), b: b.string(), c: b.string() },
            {
               uiui: {
                  Body: null,
                  Header: () => <div tw='flex'>nothing to see here</div>,
               },
            },
         ),

         c: b.header('Custom boolean header wrapping the default:'),
         testC: b.bool({
            uiui: {
               Header: ({ field: widget }) => (
                  <div tw='flex flex-1 whitespace-nowrap'>
                     <div
                        tw='cursor-pointer px-1'
                        style={{ border: '3px solid red' }}
                        onClick={() => (widget.zValue = !widget.zValue)}
                     >
                        click here
                     </div>
                     <div tw='ml-auto flex flex-nowrap'>
                        (default UI: 👉 <uy.boolean.default field={widget} /> 👈)
                     </div>
                  </div>
               ),
            },
         }),

         d: b.header('Custom string body:'),
         testD: b.string({
            body: ({ field: widget }) => <div>the string is {widget.zValue.length} char long.</div>,
         }),
      }),
   run: (ctx) => {},
})
