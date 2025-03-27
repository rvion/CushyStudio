import type { Field_number } from '../../src/csuite/fields/number/FieldNumber'

app({
   metadata: {
      description: 'show how to re-use fields multiple times.',
   },
   layout: () => [],
   ui: (b) => {
      const someExternalField = b.int().create()

      const chan = new cushy.Channel<Field_number>()
      return b.fields({
         // A. link from a field that exist somewhere else
         linkedFromField: b.fields(
            {
               val1: b.linkedFromExternalField(someExternalField),
               val2: b.linkedFromExternalField(someExternalField),
               val3: b.linkedFromExternalField(someExternalField),
            },
            {
               uiui: {
                  // Decoration: (f) => <uy.Decorations.Card {...f} contrast={30} />,
                  // Before: (f) => <>🔴</>,
                  // Header: (f) => <>coucou</>,
                  // rules: [{ selector: '', uiconf: { After: <>🟢</> } }],
               },
            },
         ),

         // B. link from a field that has been published to a channel
         linkedFromChannel: b.fields({
            val: b.int().hidden().publishSelfToChannel(chan),

            val1: b.linkedFromChannel(chan, b.int()),
            val2: b.linkedFromChannel(chan, b.int()),
            val3: b.linkedFromChannel(chan, b.int()),
         }),

         // C. link from a field that has been published to a channelId
         // same as example above, but hackier/faster when doing POCs
         linkedFromChannelId: b.fields({
            val: b.int().hidden().publishSelfToChannel('<value>'),

            val1: b.linkedFromChannelId('<value>', b.int()),
            val2: b.linkedFromChannelId('<value>', b.int()),
            val3: b.linkedFromChannelId('<value>', b.int()),
         }),

         /**
          * D. `linkedFromCustom_usingParent`
          * link without using chanels, by providing a lambda to the field
          * note that the schema is always required, so we can introspect the schema statically
          */
         linkedFromCustom_usingParent: b.fields({
            val: b.int().hidden(), // no publication
            val1: b.linkedFromCustom((f) => (f.zParent as Z.FRecord<{ val: Z.Number }>).val, b.int()),
            val2: b.linkedFromCustom((f) => (f.zParent as any).val, b.int()),
            val3: b.linkedFromCustom((f) => (f.zParent as Z.FRecord<any>).val, b.int()),
         }),

         /**
          * E. `linkedFromSharedUID`
          * mostly for when you want to see the world burn.
          * this one is very VERY VEEEERY experimental (not to say broken)
          */
         linkedFromSharedUID: b.fields({
            val1: b.linkedFromSharedUID('demo-shared', b.int()),
            val2: b.linkedFromSharedUID('demo-shared', b.int()),
            val3: b.linkedFromSharedUID('demo-shared', b.int()),
         }),
      })
   },

   run: (sdk, ui) => {
      console.clear()
      console.log(JSON.stringify(ui))
   },
})
